<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center">
        <div class="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
            <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">
                {{ "Edit User" }}
            </h1>
            <form @submit.prevent="onSubmit" class="space-y-6">

                <div class="w-full">
                    <label class="block mb-2 font-semibold text-gray-700">{{ "Search User" }}</label>
                    <ClientOnly>
                        <VSelect key="user-select" :options="userOptions" :placeholder="'Cari user...'"
                            @search="onSearch" label="full_name" :reduce="(user: UserVCC) => user"
                            v-model="selectedUser" :filterable="false" :searchable="true" :loading="userStore.loading"
                            :clearSearchOnSelect="true" :multiple="false" class="v-select"
                            style="background-color: white;" />
                        <template #fallback>
                            <div class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100">
                                Loading...
                            </div>
                        </template>
                    </ClientOnly>
                </div>

                <div class="w-full">
                    <label class="block mb-2 font-semibold text-gray-700">{{ "Role" }}</label>
                    <ClientOnly>
                        <VSelect key="role-select" :options="rolesOptions" :placeholder="'Pilih role...'" label="name"
                            :reduce="(role: Role) => role" v-model="selectedRoles" :filterable="true" :searchable="true"
                            :loading="userStore.loading" :clearSearchOnSelect="true" :multiple="true" class="v-select"
                            style="background-color: white;" />
                        <template #fallback>
                            <div class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100">
                                Loading...
                            </div>
                        </template>
                    </ClientOnly>
                </div>

                <div>
                    <label class="block mb-2 font-semibold text-gray-700" for="name">{{ "Name" }}</label>
                    <input id="name" type="text" v-model="formData.name"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800" />
                </div>

                <div>
                    <label class="block mb-2 font-semibold text-gray-700" for="username">{{ "Username" }}</label>
                    <input id="username" type="text" v-model="formData.username"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800" />
                </div>

                <div>
                    <label class="block mb-2 font-semibold text-gray-700" for="email">{{ "Email" }}</label>
                    <input id="email" type="email" v-model="formData.email"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800" />
                </div>

                <div>
                    <label class="block mb-2 font-semibold text-gray-700" for="email">{{ "Level" }}</label>
                    <select id="level" v-model="formData.level"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800">
                        <option value="" disabled>Pilih level...</option>
                        <option value="0">Pusat</option>
                        <option value="1">Induk</option>
                        <option value="2">Area</option>
                        <option value="3">Unit</option>
                    </select>
                </div>

                <div class="w-full">
                    <label class="block mb-2 font-semibold text-gray-700">{{ "Unit Code" }}</label>
                    <ClientOnly>
                        <VSelect key="unit-select" :options="unitOptions" :placeholder="'Pilih unit...'" label="label"
                            :reduce="(unit: Unit) => unit" v-model="selectedUnit" :filterable="true" :searchable="true"
                            :loading="userStore.loading" :clearSearchOnSelect="false" :multiple="false" class="v-select"
                            style="background-color: white;" />
                        <template #fallback>
                            <div class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100">
                                Loading...
                            </div>
                        </template>
                    </ClientOnly>
                </div>

                <div>
                    <label class="block mb-2 font-semibold text-gray-700" for="jabatan">{{ "Jabatan" }}</label>
                    <input id="jabatan" type="text" v-model="formData.jabatan"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800" />
                </div>

                <div>
                    <label class="block mb-2 font-semibold text-gray-700" for="email">{{ "Status" }}</label>
                    <select id="status" v-model="formData.status"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800">
                        <option value="" disabled>Pilih...</option>
                        <option value="0">Tidak aktif</option>
                        <option value="1">Aktif</option>
                        <option value="2">Banned</option>
                    </select>
                </div>

                <div>
                    <label class="block mb-2 font-semibold text-gray-700" for="password">{{ "Password" }}</label>
                    <input id="password" type="text" v-model="formData.password"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800" />
                </div>

                <div>
                    <label class="block mb-2 font-semibold text-gray-700" for="password_confirmation">
                        {{ "Password Confirmation" }}</label>
                    <input id="password_confirmation" type="text" v-model="formData.password_confirmation"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800" />
                </div>

                <button type="submit"
                    class="w-full py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition duration-200 disabled:opacity-60 cursor-pointer"
                    :disabled="loading">
                    <span v-if="loading">Menyimpan...</span>
                    <span v-else>Simpan</span>
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useUserStore } from '../../src/presentation/stores/user';
import type { Role, Unit, UserVCC } from '~/core/domain/entities/User';

const loading = ref(false)
const userStore = useUserStore();
const userOptions = computed(() => userStore.searchResults)
const rolesOptions = computed(() => userStore.roles)
const unitOptions = computed(() => userStore.units)
const snackbar = useSnackbar();

const selectedUser = ref<UserVCC | null>(null)
const selectedRoles = ref<Role[]>([])
const selectedUnit = ref<Unit | null>(null)

const formData = ref({
    name: '',
    username: '',
    email: '',
    jabatan: '',
    status: null as number | null,
    password: null as string | null,
    password_confirmation: null as string | null,
    level: null as number | null,
    unit_code: '',
    roles: [] as string[],
})

watch(() => formData.value.level, (newLevel, oldLevel) => {
    if (newLevel !== null && newLevel !== undefined) {
        userStore.getUnits(`${newLevel}`)
    }
})

watch(selectedUser, async (newUser) => {
    if (newUser) {
        formData.value.name = newUser.full_name || ''
        formData.value.email = newUser.email || ''
        formData.value.username = newUser.username || ''
        formData.value.jabatan = newUser.jabatan || ''
        formData.value.status = newUser.status || 0
        formData.value.level = newUser.level || 0

        // Load units first based on user's level, then select the unit
        if (newUser.level !== null && newUser.level !== undefined) {
            try {
                await userStore.getUnits(`${newUser.level}`)

                // After units are loaded, find and select the user's unit
                if (newUser.unit_code) {
                    const foundUnit = userStore.units.find(unit => unit.code === newUser.unit_code)
                    console.log('Found unit:', foundUnit)
                    selectedUnit.value = foundUnit || null
                    formData.value.unit_code = newUser.unit_code
                } else {
                    selectedUnit.value = null
                    formData.value.unit_code = ''
                }
            } catch (error) {
                console.error('Error loading units:', error)
                selectedUnit.value = null
                formData.value.unit_code = ''
            }
        } else {
            selectedUnit.value = null
            formData.value.unit_code = ''
        }

        // Auto-select user's existing roles
        if (newUser.roles && Array.isArray(newUser.roles)) {
            selectedRoles.value = [...newUser.roles]
            formData.value.roles = newUser.roles.map(role => role.id)
            console.log('Auto-selected roles:', selectedRoles.value)
        } else {
            selectedRoles.value = []
            formData.value.roles = []
        }
    } else {
        console.log('User deselected - clearing form')
        formData.value.name = ''
        formData.value.email = ''
        selectedRoles.value = []
        formData.value.roles = []
        selectedUnit.value = null
        formData.value.unit_code = ''
    }
})

watch(selectedRoles, (newRoles) => {
    formData.value.roles = newRoles.map(role => role.id)
}, { deep: true })

watch(selectedUnit, (newUnit) => {
    if (newUnit) {
        formData.value.unit_code = newUnit.code
    } else {
        formData.value.unit_code = ''
    }
})

const onSubmit = async () => {
    if (!selectedUser.value) {
        snackbar.add({
            type: 'warning',
            text: 'Please select a user first',
            title: 'Warning',
        })
        return;
    }

    loading.value = true;

    try {
        const response = await userStore.update(selectedUser.value.id, {
            full_name: formData.value.name,
            username: formData.value.username,
            email: formData.value.email,
            jabatan: formData.value.jabatan,
            status: formData.value.status !== null ? String(formData.value.status) : null,
            password: formData.value.password,
            password_confirmation: formData.value.password_confirmation,
            level: formData.value.level !== null ? String(formData.value.level) : null,
            unit_code: selectedUnit.value ? selectedUnit.value.code : '',
            roles: formData.value.roles,
            unit_name: selectedUnit.value ? selectedUnit.value.label : '',
        })

        if (response && response.status === 200) {
            snackbar.add({
                type: 'success',
                text: 'User updated successfully',
                title: 'Success',
            })

        } else if (response) {
            snackbar.add({
                type: 'error',
                text: response.message || `Update failed with status: ${response.data}`,
                title: 'Error',
            })
        } else {
            snackbar.add({
                type: 'error',
                text: 'No response received from server',
                title: 'Error',
            })
        }
    } catch (error: any) {
        console.error('Update error:', error);
        
        let errorMessage = 'Failed to update user';
        let statusCode = 'Unknown';
        
        if (error.response) {
            // Server responded with error status
            statusCode = error.response.status || 'Unknown';
            errorMessage = error.response.data?.message || error.response.data?.error || `Server error: ${statusCode}`;
        } else if (error.message) {
            // Network or other error
            errorMessage = error.message;
        }

        snackbar.add({
            type: 'error',
            text: `${errorMessage} (Status: ${statusCode})`,
            title: 'Error',
        })
    } finally {
        loading.value = false;
    }
}

onMounted(async () => {


    try {
        await userStore.getRoles()
        console.log('Available roles loaded:', userStore.roles)
    } catch (error) {
        console.error('Error loading roles:', error)
    }
});

const searchUsers = async (query: string) => {
    if (!query || query.length == 0) {
        userStore.searchResults = []
        return
    }
    try {
        await userStore.searchUsers(query)
        console.log('Search results:', userStore.searchResults)
    } catch (error) {
        console.error('Search error:', error)
    }
}

const onSearch = useDebounceFn(searchUsers, 300)
</script>