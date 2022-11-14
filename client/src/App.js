import EmployeeList from './components/EmployeeList';
import EmployeeContextProvider from './contexts/EmployeeContext';

function App() {
  return (
    <EmployeeContextProvider>
      <EmployeeList />
    </EmployeeContextProvider>
  );
}

export default App;
