import { useSelector, useDispatch } from 'react-redux';
import "./app.css";
import "antd/dist/antd.css";
import { useEffect } from 'react';
import { getCountriesData, selectError, selectLoading } from './redux/populationSlice';
import PopulationTable from './PopulationTable';
import { Result } from 'antd';

const App = () => {
  const dispatch = useDispatch();
  const error = useSelector(selectError)
  const loading = useSelector(selectLoading)

  useEffect(() => {
    dispatch(getCountriesData())
  }, [])

  if (error) {
    return (
      <Result
        status="error"
        title="Failed!"
      >
      </Result>
    )
  }
  
  if (loading) {
    return (
      <Result
        status="info"
        title="Loading..."
      >
      </Result>
    )
  }

  return (
    <div>
      <PopulationTable />
    </div>
  )
};

export default App;
