import { useState, useEffect } from 'react';
import Nav from '../Nav/Nav';
import ListCard from '../ListCard/ListCard';
import './Home.css';
import { instance as axios } from '../../utils/axios';

const Home = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLists = async () => {
      const { data } = await axios.get('/api/lists');
      if (data.message) {
        // TODO: Something with the error if there is one
        setLoading(false);
        return;
      }
      setLists(data);
      setLoading(false);
    }

    getLists();
  }, [])

  return (
    <div>
      <Nav active="home" />
      <div className="recently-updated-container">
        <h1 className="recently-updated-header">Most Recently Updated Lists</h1>
        <div className="recently-updated-list">
          {loading ? null :
          <>
            {lists.map(list => <ListCard id={list._id} title={list.title} subtitle={list.subtitle} updated={list.updatedAt} key={list._id} />)}
          </>
          }
        </div>
      </div>
    </div>
  );
}

export default Home;
