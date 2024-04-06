import axios from 'axios'

const mangerIds = ['3', '5', '6', '7']

const items = [
  { id: '1', product: { id: 1, name: 'A95' }, quantity: 5, pricePerUnit: 50000 },
  { id: '2', product: { id: 2, name: 'A92' }, quantity: 6, pricePerUnit: 45000 },
  { id: '3', product: { id: 3, name: 'Дизель' }, quantity: 7, pricePerUnit: 48000 },
  { id: '4', product: { id: 1, name: 'A95' }, quantity: 3, pricePerUnit: 50000 },
  { id: '5', product: { id: 2, name: 'A92' }, quantity: 10, pricePerUnit: 45000 },
  { id: '6', product: { id: 3, name: 'Дизель' }, quantity: 15, pricePerUnit: 48000 },
  { id: '7', product: { id: 1, name: 'A95' }, quantity: 9, pricePerUnit: 50000 },
]

export async function createOrders(number) {
  const apiEndpoint = process.env.API_URL || 'http://localhost:4000'

  const httpClient = axios.create({
    baseURL: apiEndpoint,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
  })

  httpClient.interceptors.request.use(onRequest)
  httpClient.interceptors.response.use(onResponseSuccess)

  function onRequest(request) {
    const accessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0aXRhbm9sZWcwNzExMDJAZ21haWwuY29tIiwibmFtZSI6ItCa0LDQu9C40L3QvtCy0YHRjNC60LjQuSDQntC70LXQsyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcxMTg4NzU0MSwiZXhwIjoxNzExODg4MTQxfQ.iZn7Bf3niqDToDcaxhZz7FwA3zGuu4rmoVzWukZ02r8'

    if (accessToken) {
      request.headers.set('Authorization', `Bearer ${accessToken}`)
    }

    return request
  }

  function onResponseSuccess(res) {
    return res
  }

  // async function onResponseError(error) {
  //   const originalRequest = error.config

  //   if (error.response.status !== 401) {
  //     throw error
  //   }

  //   try {
  //     const { token } = await authService.refresh()

  //     accessTokenService.save(token)

  //     return httpClient.request(originalRequest)
  //   } catch (error) {
  //     throw error
  //   }
  // }

  const getApi = (url) => httpClient.get(url)
  const postApi = (url, data) => httpClient.post(url, data)

  const customersRes = await getApi('/customers')
  const customers = customersRes.data

  const customerIds = customers.map((iter) => iter.id)
  const customerAddress = customers.map((iter) => iter.shippindAdress)

  // try {

  //   for (let i = 0; i < number; i++) {
  //     const customerIndex = i % customerIds.length
  //     const customerId = customerIds[customerIndex]
  //     const shippingAddress = customerAddress[customerIndex]
  //     const managerId = Number(mangerIds[customerIndex]) // Convert string to number

  //     const randomItemCount = Math.floor(Math.random() * 3) + 1 // Generates random number between 1 and 3
  //     const orderItems = []
  //     for (let j = 0; j < randomItemCount; j++) {
  //       const randomItemIndex = Math.floor(Math.random() * items.length)
  //       orderItems.push(items[randomItemIndex])
  //     }

  //     await postApi('/orders', {
  //       customerId,
  //       shippingAddress,
  //       orderItems, // Update to send the randomly selected order items
  //       managerId,
  //     })
  //   }
  // } catch (error) {
  //   console.log(error)
  // }

  try {
    for (let i = 0; i < number; i++) {
      const customerIndex = i % customerIds.length
      const customerId = customerIds[customerIndex]
      const shippingAddress = customerAddress[customerIndex]
      const managerId = Number(mangerIds[customerIndex]) // Convert string to number

      const randomItemCount = Math.floor(Math.random() * 3) + 1 // Generates random number between 1 and 3
      const orderItems = []

      if (items.length > 0) {
        while (orderItems.length < randomItemCount && orderItems.length < items.length) {
          const randomItemIndex = Math.floor(Math.random() * items.length)
          const randomProduct = items[randomItemIndex]
          if (!orderItems.some((item) => item.product.id === randomProduct.product.id)) {
            orderItems.push(randomProduct)
          }
        }
        console.log('items', orderItems)
      } else {
        console.log('No items available to create order.')
        return
      }

      console.log('HERE', orderItems)

      await postApi('/orders', {
        customerId,
        shippingAddress,
        items: orderItems, // Update to send the randomly selected order items
        managerId,
      })
    }
  } catch (error) {
    console.log(error)
  }
}

// createOrders(15)
