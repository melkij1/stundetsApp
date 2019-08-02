<template>
  <div id="app">
    <button class="btn-add"
      @click="isOpen=!isOpen"
    >
      Добавить студента
    </button>
    <ModalForm
      v-if="isOpen"
      @saveItem="saveItem"
      @close="closeModel"
      :model-index="modelIndex"
      :init-model="model"
      :error="error"
    />
    <TableStudent
      modal="false"
      :lists="lists"
      @edit_student="edit_student_method"
      @delete-item="deleteItems"
    />
  </div>
</template>

<script>
import ModalForm from './components/ModalForm.vue'
import TableStudent from './components/TableStudent.vue'
import mixins from './mixins'

export default {
  name: 'app',
  mixins: [mixins],
  data(){
    return {
      lists: [
        { id: 1, name: "Вася", family: "Петров", data: "06.10.1993", group: "ИВТ-1-15", isChecked: false, edit: false },
        { id: 2, name: "Иван", family: "Пупкин", data: "10.06.1990", group: "ИВТ-3-135", isChecked: false, edit: false },
      ],

      isOpen: false,
      model: {},
      modelIndex: null,
      error: '',
    }
  },
  components: {
    ModalForm,
    TableStudent
  },
  methods: {
    saveItem(event) {
      const { item } = event;
      this.error = this.validateStudent(item);
      if (!this.error) {
        if (item.id == null) {
          item.id = this.getMaxIdFromLists() + 1
          this.lists.push(item);
        } else {
          this.lists[this.findIndexById(item.id)] = item;
        }
        this.model = {}
        this.modelIndex = null;
        this.isOpen = false;
      }
    },
    getMaxIdFromLists () {
      return Math.max.apply(Math, this.lists.map(item => item.id))
    },
    deleteItems(ids){
      if (!ids) {
          return
      }
      ids.forEach((id) => {
          this.lists.splice(this.findIndexById(id), 1)
      })
    },
    edit_student_method(model, index) {
      this.isOpen = true;
      this.modelIndex= index;
      this.model = model
    },
    closeModel(){
      this.isOpen = false;
      this.model = {}
      this.modelIndex = null
    },
    validateStudent(student) {
      if (!/^[а-яё]+$/i.test(student.name)) {
        return 'Имя должно содержать только кириллические символы';
      }
      if (!/^[а-яё]+$/i.test(student.family)) {
        return 'Фамилия должна содержать только кириллические символы';
      }
      if (!/^[А-ЯЁ]{2,4}-[0-9]+-[0-9]+$/.test(student.group)) {
        return 'Неверный номер группы';
      }
      return '';
    },

  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.btn-add{
  font-size: 15px;
  padding: 5px 10px;
  border: transparent;
  background-color: green;
  color: #ffffff;
}
</style>
