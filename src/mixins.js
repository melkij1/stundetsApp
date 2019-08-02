export default {
    methods: {
        findIndexById(id) {
            return this.lists.findIndex(item => item.id === id)
        }
    }
}
