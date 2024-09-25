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
            'https://qg5u2h7j555msnkinngqaw2zfm0enled.lambda-url.us-east-2.on.aws/'
          );
          const fetchedItems = response.data.slice(1).map((item: any) => ({
            id: item.Id,
            type: item.Name
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
   