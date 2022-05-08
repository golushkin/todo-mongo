import DbHelper from "./DbHelper"

export const closeAll = async () => {
    await DbHelper.disconnect()

    process.exit(0)
}