export const defaultUser = {
    email: '',
    permissionLevel: 'user',
    status: 'active',
}

export const modalInputs = [
    {
        title: 'Email',
        type: 'email',
        name: 'email',
        required: true,
    },
    {
        title: 'PermissionLevel',
        type: 'select',
        name: 'permissionLevel',
        required: true,
        options: [{ name: 'User', value: 'user' }, { name: 'Admin  ', value: 'Admin' }]
    },
    {
        title: 'Status',
        type: 'select',
        name: 'status',
        required: true,
        options: [{ name: 'Active', value: 'active' }, { name: 'Pending', value: 'pending' }, { name: 'Suspended', value: 'suspended' }, { name: 'Expired', value: 'expired' }]
    },
]