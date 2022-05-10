export type TestResponseSuccess<Data = {[key: string]: any}> = {
  success: boolean,
  data: Data
}

export type TestResponseFailure = {
  success: boolean,
  error: string,
  additionalInfo: any[]
}