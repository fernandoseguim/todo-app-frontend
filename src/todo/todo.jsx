import React, { Component } from 'react'
import axios from 'axios'
import PageHeader from '../template/pageHeader'
import TodoForm from './todoForm';
import TodoList from './todoList';

const URL = 'http://localhost:23003/api/todos'


class Todo extends Component {
    constructor(props){
        super(props)
        this.state = { description: '', list: [] }
        
        this.handleChange = this.bindContext(this.handleChange)
        this.handleAdd = this.bindContext(this.handleAdd)
        this.handleRemove = this.bindContext(this.handleRemove)
        this.handleMarkAsDone = this.bindContext(this.handleMarkAsDone)
        this.handleMarkAsPending = this.bindContext(this.handleMarkAsPending)
        this.refresh()
    }
    
    bindContext(method) {
        return method.bind(this);
    }
    
    refresh(){
        axios.get(`${URL}?sort=-createdAt`)
            .then(resp => this.setState({ ...this.state, description: '', list: resp.data }))
    }

    handleChange(event) {
        this.setState({ ...this.state, description: event.target.value })
    }

    handleAdd() {
        const description = this.state.description
        axios.post(URL, { description })
            .then(resp => this.refresh())
    }

    handleRemove(todo) {
        axios.delete(`${URL}/${todo._id}`)
            .then(resp => this.refresh())
    }

    handleMarkAsDone(todo) {
        axios.put(`${URL}/${todo._id}`, { ...todo, done: true })
            .then(resp => this.refresh())
    }

    handleMarkAsPending(todo) {
        axios.put(`${URL}/${todo._id}`, { ...todo, done: false })
            .then(resp => this.refresh())
    }

    render() {
        return (
            <div>
                <PageHeader name='Tarefas' small='Cadastro' ></PageHeader>
                
                <TodoForm description={ this.state.description } 
                    handleChange={ this.handleChange }
                    handleAdd={ this.handleAdd } />

                <TodoList list={ this.state.list }
                    handleRemove={ this.handleRemove }
                    handleMarkAsDone={ this.handleMarkAsDone }
                    handleMarkAsPending={ this.handleMarkAsPending } />
            </div>
        )
    }
}

export default Todo