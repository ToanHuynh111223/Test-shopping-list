import Button from '@mui/material/Button';
import { Alert, AlertTitle } from '@mui/material';
//add color Button in mui
import { purple } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
// add color Button in mui
const theme = createTheme({
  palette: {
    primary: {
      main: purple[400],
      light: purple[500],
    },
    neutral: {
      main: '#64748B',
      contrastText: '#fff',
    },
  },
});
//post data
function postData(data) {
  fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}
function App() {
  let [newItemValue, setNewItemValue] = useState('')
  const [shoppingList, setShoppingList] = useState([])
  const [totalItem, setTotalItem] = useState(0)
  const alert = useRef()
  //get data
  useEffect(() => {
    fetch('/api')
      .then(res => res.json())
      .then(data => setShoppingList(data))
  }, [])
  // handle calculate total quantity
  useEffect(() => {
    const total = shoppingList.reduce((total, item) => { return item.isSelected ? total + 0 : total + item.quantity }, 0)
    setTotalItem(total)
  }, [shoppingList])

  // add item
  function onAddClick() {
    // Prevent the end-user from entering duplicate item name.
    if (shoppingList) {
      shoppingList.forEach((item, index) => {
        if (newItemValue) {
          if (newItemValue.toLocaleUpperCase() === item.itemName.toLocaleUpperCase()) {
            alert.current.style.display = 'flex'
            setNewItemValue('')
            newItemValue = ''
          }
        }
      })
    }
    //add
    if (newItemValue) {
      let newItem = {
        itemName: newItemValue,
        quantity: 1,
        isSelected: false,
      }
      const newItems = [...shoppingList, newItem]
      setShoppingList(newItems)
      setNewItemValue('')
      postData(newItem)
      alert.current.style.display = 'none'
    }

  }

  // Toggle complete
  function toggleComplete(index) {
    const newItems = [...shoppingList];
    newItems[index].isSelected = !newItems[index].isSelected;
    setShoppingList(newItems)
  }
  // Increase quantity
  function handleIncreaseQuantum(index) {
    const newItems = [...shoppingList];
    newItems[index].quantity++
    setShoppingList(newItems)

  }
  // Decrease quantity
  function handleDecreaseQuantum(index) {
    const newItems = [...shoppingList];
    newItems[index].quantity--
    if (newItems[index].quantity <= 1) {
      newItems[index].quantity = 1
    }
    setShoppingList(newItems)
  }

  return (
    <div className='app-background'>
      <Alert severity="error" onClose={() => { alert.current.style.display = 'none' }} className='message' ref={alert}>
        <AlertTitle>Error</AlertTitle>
        Nội dung này đã tồn tại — <strong>Vui lòng kiểm tra lại!</strong>
      </Alert>
      <div className='main-container'>
        <form className='add-item-box' >
          <input className='add-item-input' placeholder='Add an item...' value={newItemValue} onChange={(e) => { setNewItemValue(e.target.value) }} />
          <ThemeProvider theme={theme}>
            <Button variant="contained" size="small" color="primary" onClick={onAddClick} >add</Button>
          </ThemeProvider>
        </form>
        <div className='list-container'>
          <ul className='list-shopping'>
            {
              shoppingList.map((item, index) => {
                return (<li className='item-name' key={index} >
                  {item.isSelected ? (<span className='complete' onClick={() => toggleComplete(index)}>{item.itemName}</span>) : (<span onClick={() => toggleComplete(index)}>{item.itemName}</span>)}
                  <div className='quantity'>
                    <button onClick={() => handleDecreaseQuantum(index)}>
                      -
                    </button>
                    <span> {item.quantity} </span>
                    <button onClick={() => handleIncreaseQuantum(index)}>
                      +
                    </button>
                  </div>
                </li>)
              })
            }
          </ul>
        </div>
        <div className='total'>Total: {totalItem}</div>
      </div>
    </div>

  );
}

export default App;
