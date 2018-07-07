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
        this.handleSearch = this.bindContext(this.handleSearch)
        this.handleClear = this.bindContext(this.handleClear)
        this.refresh()
    }
    
    bindContext(method) {
        return method.bind(this);
    }
    
    refresh(description = ''){
        const search = description ? `&description__regex=/${description}/` : ''
        axios.get(`${URL}?sort=-createdAt$${search}`)
            .then(resp => this.setState({ ...this.state, description, list: resp.data }))
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
            .then(resp => this.refresh(this.state.description))
    }

    handleMarkAsDone(todo) {
        axios.put(`${URL}/${todo._id}`, { ...todo, done: true })
            .then(resp => this.refresh(this.state.description))
    }

    handleMarkAsPending(todo) {
        axios.put(`${URL}/${todo._id}`, { ...todo, done: false })
            .then(resp => this.refresh(this.state.description))
    }

    handleSearch() {
        this.refresh(this.state.description)
    }

    handleClear() {
        this.refresh()
    }

    render() {
        return (
            <div>
                <PageHeader name='Tarefas' small='Cadastro' ></PageHeader>
                
                <TodoForm description={ this.state.description } 
                    handleChange={ this.handleChange }
                    handleAdd={ this.handleAdd }
                    handleSearch={ this.handleSearch }
                    handleClear={ this.handleClear } />

                <TodoList list={ this.state.list }
                    handleRemove={ this.handleRemove }
                    handleMarkAsDone={ this.handleMarkAsDone }
                    handleMarkAsPending={ this.handleMarkAsPending } />
            </div>
        )
    }
}

export default Todo