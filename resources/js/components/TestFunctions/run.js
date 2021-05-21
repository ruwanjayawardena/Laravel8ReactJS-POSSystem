import React from 'react'
import ReactDOM from 'react-dom'

const GreetSomeone = ({greeting, subject}) => {
    return (
      <div>
        {greeting} {subject}!
      </div>
    )
}


const App = () => {
    const [greeting, setGreeting] = React.useState('HELLO')

    const handleGreetingChange = (event) => {
        console.log(event);
        const input = event.target
        const newGreeting = input.value.toUpperCase()
        setGreeting(newGreeting)
    }


    return (
        <form>
            <div>
                <label htmlFor="greeting">Greeting: </label>
                <input id="greeting" onChange={handleGreetingChange} value={greeting} />
            </div>
            <div>
                <GreetSomeone greeting={greeting} subject="Nancy" />
            </div>
        </form>
    )
}

export default App

const root = document.getElementById('app');
if (document.getElementById('app')) {
    ReactDOM.render(<App/>,root);
}

