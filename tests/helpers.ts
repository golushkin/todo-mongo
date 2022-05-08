export const expectSuccessBody = (body: any) => {
  expect(typeof body).toBe('object')
  expect(body).toHaveProperty('success')
  expect(body).toHaveProperty('data')
}