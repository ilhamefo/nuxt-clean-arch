// Mock API endpoint for testing
// Create this file as: server/api/transactions.post.ts

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  console.log('Received transaction request:', body)
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock validation
  if (!body.date_start || !body.date_end) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation Error',
      data: { error: 'validation_failed', message: 'Date range is required' }
    })
  }
  
  // Mock response data
  const mockTransactions = [
    {
      id: '1',
      amount: 1500000,
      date: body.date_start,
      description: 'Transaksi Penjualan Produk A',
      type: 'income',
      unit_code: body.unit_code || 'UNIT001',
      area_id: body.id_area || 'AREA001'
    },
    {
      id: '2',
      amount: 750000,
      date: body.date_start,
      description: 'Pembayaran Supplier B',
      type: 'expense',
      unit_code: body.unit_code || 'UNIT001',
      area_id: body.id_area || 'AREA001'
    },
    {
      id: '3',
      amount: 2250000,
      date: body.date_end,
      description: 'Transaksi Penjualan Produk C',
      type: 'income',
      unit_code: body.unit_code || 'UNIT002',
      area_id: body.id_area || 'AREA002'
    }
  ]
  
  // Filter based on parameters if provided
  let filteredTransactions = mockTransactions
  
  if (body.unit_code) {
    filteredTransactions = filteredTransactions.filter(t => t.unit_code === body.unit_code)
  }
  
  return {
    data: filteredTransactions,
    message: 'Transactions retrieved successfully',
    status: 200,
    meta: {
      total: filteredTransactions.length,
      date_range: {
        start: body.date_start,
        end: body.date_end
      },
      filters: {
        id_pusat: body.id_pusat,
        id_induk: body.id_induk,
        id_area: body.id_area,
        unit_code: body.unit_code
      }
    }
  }
})
