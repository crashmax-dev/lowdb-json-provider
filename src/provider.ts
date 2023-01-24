import { sep } from 'node:path'
import { JSONFile } from 'lowdb/node'
import { LowDatabase } from './database.js'
import { LowDirectoryProvider } from './directory.js'
import { Entities, LowBaseEntity } from './entities.js'
import { LoggerProvider, WinstonLogger } from './logger.js'
import type { LowDatabaseOptions, LowProviderOptions } from './types.js'

export class LowProvider {
  private readonly directoryProvider: LowDirectoryProvider
  private readonly loggerProvider: LoggerProvider
  private readonly databaseLogger: WinstonLogger
  private readonly entities: Entities

  constructor({ path, entities, logger }: LowProviderOptions) {
    this.directoryProvider = new LowDirectoryProvider(path)
    this.loggerProvider = new LoggerProvider({
      path,
      options: logger
    })

    this.entities = new Entities(this.loggerProvider)
    this.entities.registerEntities((entities as LowBaseEntity[]) ?? [])
    const databaseFolder = path.split(sep).pop() ?? 'database'
    this.databaseLogger = this.loggerProvider.createLogger(databaseFolder)
    this.directoryProvider.setLogger(this.databaseLogger)
  }

  async createDatabase<T extends unknown>({
    name,
    initialData
  }: Omit<LowDatabaseOptions<T>, 'logger' | 'adapter' | 'directory'>): Promise<
    LowDatabase<T>
  > {
    const file = this.directoryProvider.getDatabaseFile(name)
    const adapter = new JSONFile<T>(file)
    this.directoryProvider.removeFile(file)

    const db = new LowDatabase<T>({
      name,
      adapter,
      logger: this.loggerProvider,
      directory: this.directoryProvider
    })

    db.setInitialData(initialData)

    await db.read()

    if (initialData && !db.data) {
      this.databaseLogger.info(`Initializing database: ${file}`, initialData)
      db.data ||= initialData
      await db.write()
    }

    return db
  }
}
