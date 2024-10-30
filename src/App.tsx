
import './App.css';
import DonationForm from './DonationForm/DonationForm.tsx';
import ItemForm from './DonationItemForm/DonationItemForm.tsx'
import CharityForm from './DonationCharityForm/DonationCharityForm.tsx'
function App() {
   return (
         <>
         <div className='appContainer'>
            <h2 className='contrastText'>Tell us more about your items and preferences</h2>
            <button className='resetButton'>Reset all selections</button>
         </div>
         <DonationForm/>
         <ItemForm/>
        <CharityForm/>
         <button className='submitButton'>Continue to results</button>
        </>
   );
}

export default App;
