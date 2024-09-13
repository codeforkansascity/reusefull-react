import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DonationCharityForm.css'; // Assuming you create a CSS file for styling

type Item = {
  id: number;
  type: string;

}



function charityForm () {
  const [org,setOrgs] = useState<Item[]>([]);
  const [selectedOrg, setSelectedOrgs] = useState<number[]>([]);
  const [displayText, setDisplayText] = useState<string>("Select All")

  useEffect( () => {
    async function fetchData() {
      try {
        const response = await axios.get(
          'https://script.googleusercontent.com/macros/echo?user_content_key=L_BJnslcNPLjr0ci1JH7QckljkitdQaJ4DU3ICri5Khzos2k1rgtSW6UrH0HPZk06VmMs4k0EtBM00QkrQx0iJv2QJtuTgvxm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnCswIUprwEMkmXJ24KNma3jpFSTlPcbHfPamtIbp5EnAD8LtrluZqlo8Xg7uY4vD7Xj2xXWpg4GVMpaB8IleFVxLtgLZIrtqhw&lib=MBa0ZAi4iwRAcqTZQXaoXQwwJX0hRdcSS'
        );

        const fetchedItems = response.data.splice(1).map((item: any[]) => ({
          id: item[0],
          type: item[1]
        }));
        setOrgs(fetchedItems);
      } catch (error) {
        console.log("Error:", error)
      }
    }

  fetchData()
  },[]);

  function handleCheckboxChange(orgID: number) {
    setSelectedOrgs( (prevSelectedOrgs) => {
      if (prevSelectedOrgs.includes(orgID)) {
        return prevSelectedOrgs.filter( (org) => org !== orgID)
      } else{
        return [...prevSelectedOrgs, orgID]
      }

    });
  };
  function SelectAll() {
    // const allOrgIDs = org.map((orgItem) => orgItem.id);
    // setSelectedOrgs(allOrgIDs);

    if (selectedOrg.length === org.length) {
      setSelectedOrgs([]);
    } else {
      const allOrgIDs = org.map((orgItem) => orgItem.id);
      setSelectedOrgs(allOrgIDs);
    }

  }

  return (

    <>
    <div className="form-container">
      <h2>What kind of organization do you want to donate to?</h2>
      <a 
        href="#" 
        className="Add-selections" 
        onClick={ (e) => {
          e.preventDefault();
          SelectAll();
        }}>
         {selectedOrg.length === org.length ? 'Deselect All' : 'Select All'}
      </a>
      <div className="checkbox-grid">
        {org.map((org) => (
          <label key={org.id} className="checkbox-label">
            <input
            type="checkbox"
            checked={selectedOrg.includes(org.id)}
            onChange={() => handleCheckboxChange(org.id)}
            />
            
            {org.type}
          </label>

        ))}
      </div>
    </div>
    </>
  )

}


export default charityForm