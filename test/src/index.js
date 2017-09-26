import React, { Component, PropTypes } from 'react'
import ReactDOM  from 'react-dom'
import { createStore, bindActionCreators } from 'redux'
import {Provider, connect} from '../../src/index'
import actions, { VisibilityFilters } from './actions'
import AddTodo from './components/AddTodo'
import TodoList from './components/TodoList'
import Footer from './components/Footer'
import todoApp from './reducers'

class App extends Component {
  componentDidMount() {
    console.log("app componentDidMount");
  }

  componentWillUpdate(nextStates, props) {
    console.log(nextStates, props);
  }

  render() {
    const { visibleTodos, visibilityFilter, actions } = this.props

    return (
      <div>
        <AddTodo
          onAddClick={text =>
            actions.addTodo(text)
          }/>
        <TodoList
          todos={visibleTodos}
          onTodoClick={index =>
            actions.completeTodo(index)
          }/>
        <Footer
          filter={visibilityFilter}
          onFilterChange={nextFilter =>
            actions.setVisibilityFilter(nextFilter)
          }/>
      </div>
    )
  }
}

App.propTypes = {
  visibleTodos: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  }).isRequired).isRequired,
  visibilityFilter: PropTypes.oneOf([
    'SHOW_ALL',
    'SHOW_COMPLETED',
    'SHOW_ACTIVE'
  ]).isRequired
}

function selectTodos(todos, filter) {
  switch (filter) {
    case VisibilityFilters.SHOW_ALL:
      return todos
    case VisibilityFilters.SHOW_COMPLETED:
      return todos.filter(todo => todo.completed)
    case VisibilityFilters.SHOW_ACTIVE:
      return todos.filter(todo => !todo.completed)
  }
}

// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
function select(state, props) {
  console.log(props);
  return {
    visibleTodos: selectTodos(state.todos, state.visibilityFilter),
    visibilityFilter: state.visibilityFilter,
  }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) }
}

const FinalApp = connect(select, mapDispatchToProps)(App)

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
let store = createStore(todoApp)

ReactDOM.render(
  <Provider store={store}>
    <FinalApp />
  </Provider>,
  document.getElementById('app')
)