import React, { useState, useEffect } from "react";
import './App.css';

const URL = 'http://localhost/shoplist/';

function App() {

  const [Items, setItems] = useState([]);
  const [Item, setItem] = useState('type description');
  const [Amount, setAmount] = useState('type amount');

  useEffect(() => {
    let status = 0;
    fetch(URL + 'index.php')
    .then(res => {
      status = parseInt(res.status);
      return res.json()
    })
    .then(
      (res) => {
        if (status === 200) {
          setItems(res);
        } else {
          alert(res.error)
        }
      }, (error) => {
        alert(error);
      }
    )
  }, [])

  function save(e) {
    e.preventDefault();
    let status = 0;
    fetch(URL + 'add.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: Item,
        amount: Amount
      })
    })
    .then(res => {
      status = parseInt(res.status);
      return res.json()
    })
    .then(
      (res) => {
        if (status === 200) {
          setItems(items => [...items,res]);
          setItem('type description');
          setAmount('type amount');
        } else {
          alert(res.error);
        }
      }, (error) => {
        alert(error);
      }
    )
  }

  function remove(id) {
    let status = 0;
    fetch(URL + "delete.php", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id
      })
    })
    .then(res => {
      status = parseInt(res.status);
      return res.json();
    })
    .then(
      (res) => {
        if (status === 200) {
          const NewListWithoutRemoved = Items.filter((item) => item.id !== id);
          setItems(NewListWithoutRemoved);
        } else {
          alert(res.error);
        }
      }, (error) => {
        alert(error);
      }
    )
  }

  return (
    <div className='container'>
      <h3>Shopping List</h3>
      <form className='container' onSubmit={save}>
        <label>New item</label>
        <input value={Item} onChange={e => setItem(e.target.value)} />
        <input value={Amount} onChange={e => setAmount(e.target.value)} />
        <button>Save</button>
      </form>
      <ol>
        {Items.map(item => (
          <li className='items' key={item.id}>
            {item.description}  {item.amount}
            <button className="delete" onClick={() => remove(item.id)} href="#">Delete</button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default App;
