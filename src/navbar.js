import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css'

export default class Navbar extends Component {
  state = {}

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Menu stackable>
        <Menu.Item>
          <img src='https://react.semantic-ui.com/logo.png' />
        </Menu.Item>

        <Menu.Item
        as={Link} to="/"
          name='liveFeed'
          active={activeItem === 'LiveFeed'}
          onClick={this.handleItemClick}
        >
          Live Feed
        </Menu.Item>

        <Menu.Item
        as={Link} to="/readings"
          name='readings'
          active={activeItem === 'readings'}
          onClick={this.handleItemClick}
        >
          Sensor Readings
        </Menu.Item>

      </Menu>
    )
  }
}