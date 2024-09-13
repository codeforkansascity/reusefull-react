
import './App.css';
import DonationForm from './DonationForm/DonationForm.tsx';
import ItemForm from './DonationItemForm/DonationItemForm.tsx'
import CharityForm from './DonationCharityForm/DonationCharityForm.tsx'
function App() {
   return (
         <>
         <DonationForm/>
         <ItemForm/>
        <CharityForm/>
        </>
   );
}

export default App;
