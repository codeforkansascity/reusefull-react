import { useState, useEffect } from 'react';
import axios from 'axios';
import './DonationItemsForm.css'; // Assuming you create a CSS file for styling

  type Item = {
    id: number;
    type:string;
  }

  function DonationItemsForm(){
    const [items,setItems] = useState<Item[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    useEffect(() => {
      async function fetchData() {
        try {
          const response  = await axios.get(
            'https://script.googleusercontent.com/macros/echo?user_content_key=ydX5gydWi9L2xQBy1cPqAfvo2G4XvKjRWlGR-OXPSE3oirQwZ6uAUfkysSgTax07ktXFu9uPesC7PkLjJ_64poV_wpLu0ztEm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnGDlHvq5n_D40Y8x4mOJ1B2ULLy_b6sRcTN7cGIjX0RivU4j_0iU8FyF1VOvCUmRq1Nik-KSHOklQG3fvj277uMDK7uTYojcUg&lib=M3qiWZiUFP0JC88b7jR5VfwwJX0hRdcSS'
          );
          const fetchedItems = response.data.slice(1).map((item: any[]) => ({
            id: item[0],
            type: item[1]
          }));
          setItems(fetchedItems);
        } catch (error) {
          console.error("Error:",error)
        }
      }

      fetchData();
    },[]);


    function handleCheckboxChange(itemID : number) {
      setSelectedItems( (prevSelectedItem) => {
        if (prevSelectedItem.includes(itemID)) {
          return prevSelectedItem.filter((currentID) => currentID !== itemID);
        } else{
          return [...prevSelectedItem, itemID]
        }
      });
    };


    function handleClearSelection() {
      setSelectedItems([]);
    }



    return (

      <>
      <div className="form-container">
        <h2>What kinds of items do you have to donate?</h2>
        <a 
          href="#" 
          className = "clear-selections" 
          onClick={(e) => {
            e.preventDefault();
            handleClearSelection();
          }}>
          Clear selections
        </a>
        <div className="checkbox-grid">
            {items.map((item) => (
              <label key={item.id} className="checkbox-label">
                <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => handleCheckboxChange(item.id)}
                />
                {item.type}
              </label>
            ))}
        </div>
      </div>
      </>
    );
};

export default DonationItemsForm;
   