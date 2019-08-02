<template>
  <div class="wrapper">
    <div class="search-block">
      Поиск <input type="text" class="search" v-model="search" placeholder="Введите фамилию"  autofocus />
    </div>
    <table class="table-student">
      <thead>
        <tr>
          <th
            v-for="(column, i) in columns"
            :key="i"
          >
            {{ column.name }}
            <button
              v-if="column.sorted"
              @click="sortHandler(column)"
              :class="[
              'sort-icon',
              { active: sortColumn === column},
              { desc: sortColumn === column && sortOrder === 'desc' },
            ]"
            >
              >
            </button>
            <SelectFilter
              v-if="column.filtered"
              :values="filterValues(column.prop)"
              @change="filterHandler(column.prop, $event)"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(list, index) in currentLists" :key="index" :class="{active: list.isChecked}"
        @click="list.isChecked = !list.isChecked" :id="list.id">
          <th><input type="checkbox" class="list-item-checkbox" v-model="list.isChecked"/></th>
          <th  >
            {{list.name}}
          </th>
          <th >
              {{list.family}}
          </th>
          <th >{{list.data}}</th>
          <th >{{list.group}}</th>
          <th>
            <button  class="btn-edit"  @click="showeditModal(index)">Изменить</button>
          </th>
        </tr>
      </tbody>
      <button @click="deleteItems()" class="btn-delet">Удалить</button>
    </table>
  </div>
</template>

<script>
import SelectFilter from '../components/Filter';

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

export default {
  props: {
    lists: {
      required: true,
      type: Array
    },
  },
  components: {
    SelectFilter,
  },
  created(){
    document.addEventListener('keydown', ({code}) => {
    if (code !== 'Delete' && code !== 'Backspace') {
      return
    }
      this.deleteItems()
    });
  },
  data(){
    return {
      columns: [
        { name: '', prop: '' },
        { name: 'Имя', prop: 'name' },
        { name: 'Фамилия', prop: 'family', sorted: true },
        { name: 'Возраст', prop: 'data', sorted: true, filtered: true },
        { name: 'Группа', prop: 'group', sorted: true, filtered: true },
      ],
      search: '',
      sortColumn: {},
      sortOrder: 'asc',
      filters: [],
    }
  },
  methods: {
    deleteItems: function () {
      this.$emit('delete-item', this.getSelectedIdsFromList());
    },
    getSelectedIdsFromList() {
        return this.lists
            .filter(item => item.isChecked === true)
            .map(item => item.id)
    },
    showeditModal: function (index) {
      this.$emit('edit_student', this.currentLists[index], index);
    },
    sortHandler(column) {
      if (this.sortColumn.name === column.name) {
        this.sortOrder = (this.sortOrder === 'asc')
          ? 'desc' : 'asc';
      } else {
        this.sortOrder = 'asc';
        this.sortColumn = column;
      }
    },
    filterValues(field) {
      return [...new Set(this.lists.map(item => item[field]))];
    },
    filterHandler(prop, event) {
      const value = event.target.value;
      const index = this.filters.findIndex(item => item.prop === prop);
      if (index === -1 && value) {
        this.filters.push({ prop, value });
      } else {
        this.filters.splice(index, 1);
        if (value) {
          this.filters.push({ prop, value });
        }
      }
    }
  },
  computed: {
    currentLists() {
      let result = [];
      // поиск по фамилии
      result = this.lists.filter(list => {
        return list.family.toLowerCase().includes(this.search.toLowerCase())
      });
      // сортировка
      if (this.sortColumn.name) {
        const order = (this.sortOrder === 'asc') ? '' : '-';
        result = result.sort(dynamicSort(`${order}${this.sortColumn.prop}`));
      }
      // фильтрация
      if (this.filters.length) {
        result = result.filter(item => {
          for (let filter of this.filters) {
            if (item[filter.prop] !== filter.value) {
              return false;
            }
          }
          return true;
        });
      }
      return result;
    }
  }
}
</script>

<style scoped>
  .table-student{
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
    padding-top: 50px;
    color: #1e2459;
  }
  .table-student tbody tr{
    cursor: pointer;
  }
  .table-student tbody .active{
    background-color: #1e2459;
    color: #ffffff;
  }
  .table-student tbody tr:nth-child(even){
    background-color: #f2f2f2;
  }

  .table-student tbody .active:nth-child(even){
    background-color: #1e2459;
  }

  .btn-delet{
    margin-top: 10px;
    float: right;
    background: red;
    color: #ffffff;
    border: transparent;
    font-size: 15px;
  }
  .btn-edit{
    font-size: 15px;
    border: transparent;
    background-color: green;
    color: #ffffff;
  }
  .table-student tbody tr:hover{
    background-color: #f5ec90;
  }
  .search-block{
    margin-top: 30px;
  }
  .sort-icon {
    transform: rotate(90deg);
  }
  .sort-icon.active {
    color: red;
  }
  .sort-icon.desc {
    transform: rotate(270deg);
  }
</style>
