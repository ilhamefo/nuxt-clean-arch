<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-4xl mx-auto px-4">
            <div class="bg-white shadow-lg rounded-xl p-8">
                <h1 class="text-3xl font-bold mb-8 text-center text-gray-800">
                    {{ "Data Transaksi" }}
                </h1>

                <!-- Filter Form -->
                <form @submit.prevent="onSubmit" class="space-y-6 mb-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Date Start -->
                        <div>
                            <label class="block mb-2 font-semibold text-gray-700" for="date_start">
                                {{ "Tanggal Mulai" }}
                            </label>
                            <input 
                                id="date_start" 
                                type="date" 
                                v-model="formData.date_start"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                                required 
                            />
                        </div>

                        <!-- Date End -->
                        <div>
                            <label class="block mb-2 font-semibold text-gray-700" for="date_end">
                                {{ "Tanggal Akhir" }}
                            </label>
                            <input 
                                id="date_end" 
                                type="date" 
                                v-model="formData.date_end"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                                required 
                            />
                        </div>

                        <!-- ID Pusat -->
                        <div>
                            <label class="block mb-2 font-semibold text-gray-700" for="id_pusat">
                                {{ "ID Pusat" }}
                            </label>
                            <input 
                                id="id_pusat" 
                                type="text" 
                                v-model="formData.id_pusat"
                                placeholder="Masukkan ID Pusat (opsional)"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                            />
                        </div>

                        <!-- ID Induk -->
                        <div>
                            <label class="block mb-2 font-semibold text-gray-700" for="id_induk">
                                {{ "ID Induk" }}
                            </label>
                            <input 
                                id="id_induk" 
                                type="text" 
                                v-model="formData.id_induk"
                                placeholder="Masukkan ID Induk (opsional)"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                            />
                        </div>

                        <!-- ID Area -->
                        <div>
                            <label class="block mb-2 font-semibold text-gray-700" for="id_area">
                                {{ "ID Area" }}
                            </label>
                            <input 
                                id="id_area" 
                                type="text" 
                                v-model="formData.id_area"
                                placeholder="Masukkan ID Area (opsional)"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                            />
                        </div>

                        <!-- Unit Code -->
                        <div>
                            <label class="block mb-2 font-semibold text-gray-700" for="unit_code">
                                {{ "Unit Code" }}
                            </label>
                            <input 
                                id="unit_code" 
                                type="text" 
                                v-model="formData.unit_code"
                                placeholder="Masukkan Unit Code (opsional)"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                            />
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <div class="flex justify-center space-x-4">
                        <button 
                            type="submit"
                            class="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition duration-200 disabled:opacity-60"
                            :disabled="loading"
                        >
                            <span v-if="loading" class="flex items-center">
                                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading...
                            </span>
                            <span v-else>{{ "Ambil Data Transaksi" }}</span>
                        </button>

                        <button 
                            type="button"
                            @click="resetForm"
                            class="px-8 py-3 bg-gray-600 text-white font-bold rounded-lg shadow hover:bg-gray-700 transition duration-200"
                        >
                            {{ "Reset" }}
                        </button>
                    </div>
                </form>

                <!-- API Payload Preview -->
                <div class="mb-8">
                    <h3 class="text-lg font-semibold mb-4 text-gray-800">{{ "API Payload Preview:" }}</h3>
                    <div class="bg-gray-100 p-4 rounded-lg border">
                        <pre class="text-sm text-gray-700 overflow-x-auto">{{ JSON.stringify(apiPayload, null, 2) }}</pre>
                    </div>
                </div>

                <!-- Results Section -->
                <div v-if="apiResponse" class="mt-8">
                    <h3 class="text-lg font-semibold mb-4 text-gray-800">
                        {{ "API Response:" }}
                        <span class="text-sm font-normal text-gray-600">
                            ({{ transactions.length }} records)
                        </span>
                    </h3>
                    <div class="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <pre class="text-sm text-gray-700 overflow-x-auto">{{ JSON.stringify(apiResponse, null, 2) }}</pre>
                    </div>
                </div>

                <!-- Transaction Data Table -->
                <div v-if="transactions.length > 0" class="mt-8">
                    <h3 class="text-lg font-semibold mb-4 text-gray-800">
                        {{ "Data Transaksi" }} ({{ transactions.length }} records)
                    </h3>
                    <div class="overflow-x-auto">
                        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tanggal
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Deskripsi
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Jumlah
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Unit Code
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tipe
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                <tr v-for="transaction in transactions" :key="transaction.id" class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {{ transaction.id }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {{ transaction.date }}
                                    </td>
                                    <td class="px-6 py-4 text-sm text-gray-900">
                                        {{ transaction.description }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                        {{ transaction.amount ? transaction.amount.toLocaleString('id-ID') : '-' }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {{ transaction.unit_code || '-' }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span :class="[
                                            'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                                            transaction.type === 'income' ? 'bg-green-100 text-green-800' : 
                                            transaction.type === 'expense' ? 'bg-red-100 text-red-800' : 
                                            'bg-gray-100 text-gray-800'
                                        ]">
                                            {{ transaction.type || '-' }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Error Section -->
                <div v-if="error" class="mt-8">
                    <h3 class="text-lg font-semibold mb-4 text-red-800">{{ "Error:" }}</h3>
                    <div class="bg-red-50 border border-red-200 p-4 rounded-lg">
                        <p class="text-red-700">{{ error }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTransactionStore } from '../../src/presentation/stores/transaction'
import type { TransactionPayload } from '../../src/core/domain/entities/Transaction'

// Set page meta
definePageMeta({
    title: 'Data Transaksi',
    layout: 'default'
})

// Stores
const transactionStore = useTransactionStore()

// Reactive data
const loading = computed(() => transactionStore.loading)
const error = computed(() => transactionStore.error)
const transactions = computed(() => transactionStore.transactions)
const apiResponse = ref<any>(null)

// Form data
const formData = ref({
    date_start: '',
    date_end: '',
    id_pusat: '',
    id_induk: '',
    id_area: '',
    unit_code: ''
})

// Computed API payload
const apiPayload = computed(() => {
    return {
        date_end: formData.value.date_end ? formData.value.date_end.replace(/-/g, '/') : '',
        date_start: formData.value.date_start ? formData.value.date_start.replace(/-/g, '/') : '',
        id_area: formData.value.id_area || '',
        id_induk: formData.value.id_induk || '',
        id_pusat: formData.value.id_pusat || '',
        unit_code: formData.value.unit_code || ''
    } as TransactionPayload
})

// Initialize form with current month
const initializeForm = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    
    formData.value.date_start = `${year}-${month}-01`
    formData.value.date_end = `${year}-${month}-${new Date(year, now.getMonth() + 1, 0).getDate().toString().padStart(2, '0')}`
}

// Reset form
const resetForm = () => {
    formData.value = {
        date_start: '',
        date_end: '',
        id_pusat: '',
        id_induk: '',
        id_area: '',
        unit_code: ''
    }
    apiResponse.value = null
    transactionStore.clearError()
    transactionStore.clearTransactions()
    initializeForm()
}

// Submit form
const onSubmit = async () => {
    if (!formData.value.date_start || !formData.value.date_end) {
        // You can use a toast/snackbar here if available
        alert('Tanggal mulai dan tanggal akhir harus diisi')
        return
    }

    // Validate date range
    const startDate = new Date(formData.value.date_start)
    const endDate = new Date(formData.value.date_end)
    
    if (startDate > endDate) {
        alert('Tanggal mulai tidak boleh lebih besar dari tanggal akhir')
        return
    }

    transactionStore.clearError()
    apiResponse.value = null

    try {
        console.log('Sending API payload:', apiPayload.value)
        
        const response = await transactionStore.getTransactions(apiPayload.value)
        
        if (response) {
            apiResponse.value = response
            console.log('API Response:', response)
            console.log('Transactions loaded:', transactions.value.length)
            
            // Show success message if you have a toast/snackbar system
            // snackbar.add({ type: 'success', text: `Loaded ${transactions.value.length} transactions` })
        }

    } catch (err: any) {
        console.error('Submit Error:', err)
        // Error is already handled in the store
        // You can add additional error handling here if needed
    }
}

// Initialize form on mount
onMounted(() => {
    initializeForm()
})
</script>

<style scoped>
/* Custom styles if needed */
.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
</style>
