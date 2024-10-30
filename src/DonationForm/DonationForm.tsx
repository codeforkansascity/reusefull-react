import { useState } from "react";
import "./DonationForm.css"; // Assuming you create this CSS file

function DonationForm() {
  const [pickupOption, setPickupOption] = useState( {charityPickup: false, personalPickup: false,});
  const [considerations, setConsiderations] = useState({resellItems: false,faithBased: false,});

  const [itemCondition, setItemCondition] = useState<string>('new');

  function handleItemConditionChange(e: React.ChangeEvent<HTMLInputElement>) {
    setItemCondition(e.target.value);
  }

  function handleExtraConsiderationChange(e: React.ChangeEvent<HTMLInputElement>) {
    const {name, checked} = e.target;
    setConsiderations(prev => ({...prev, [name]: checked}));
  }

  function handlePickupChange(e: React.ChangeEvent<HTMLInputElement>){
    const {name,checked} = e.target;
    setPickupOption(prev => ({...prev,[name] : checked}));
  }

  return (
    <>
    <div className="form-container">
    <h2 className="question">How would you like to get your donation to the charity?</h2>

    <form>
      <label>
        <input
          type="checkbox" 
          id="charityPickup" 
          name="charityPickup" 
          checked={pickupOption.charityPickup}
          onChange={handlePickupChange}/>
        Charity will pickup my items
      </label>

      <label>
        <input
          type="checkbox"
          id="personalPickup"
          name="personalPickup"
          checked={pickupOption.personalPickup}
          onChange={handlePickupChange}/>
        I will drop-off items
      </label>
    
    </form>
    
    <h2 className="question">Do you have any extra considerations?</h2>

    <form>
      <label>
        <input 
          type="checkbox"
          id="resellItems" 
          name="resellItems" 
          checked={considerations.resellItems} 
          onChange={handleExtraConsiderationChange}/>
          Include organizations that resell items
      </label>

      <label>
        <input
          type="checkbox" 
          id="faithBased"
          name="faithBased" 
          checked={considerations.faithBased}
          onChange={handleExtraConsiderationChange}/>
          Include faith-based organizations
      </label>
    
    </form>

    <h2 className="question">Are your items new or used?</h2>

    <form>
      <label>
        <input
          type="radio"
          id="newItems"
          name="itemCondition"
          value="new"
          checked={itemCondition === 'new'}
          onChange={handleItemConditionChange}/>
          New items
      </label>

      <label>
        <input
          type="radio" 
          id="usedItems"
          name="itemCondition"
          value="used"
          checked={itemCondition === 'used'}
          onChange={handleItemConditionChange}/>
          Used items
      </label>
    
    </form>




    </div>
    
    
    </>

  );
}

export default DonationForm;
