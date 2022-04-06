import DbHelper from "./DbHelper"

export const closeAll = async () => {
    await DbHelper.diconnect()

    process.exit(0)
}