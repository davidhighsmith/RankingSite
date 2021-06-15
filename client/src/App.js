import { Switch, Route } from 'react-router-dom';
import ListInfo from './components/ListInfo/ListInfo';
import Lists from './components/Lists/Lists';
import Home from './components/Home/Home';
import AllLists from './components/AllLists/AllLists';
import AllMedia from './components/AllMedia/AllMedia';
import TempMedia from './components/TempMedia/TempMedia';
import Media from './components/Media/Media';
import ListCreate from './components/ListCreate/ListCreate';
import TestMovieList from './components/ZTestMovieList/TestMovieList';
import './App.css';

const App = () => {
  return (
    <>
      <Switch>
        <Route exact path="/lists/movie">
          <TestMovieList />
        </Route>
        <Route exact path="/lists/create">
          <ListCreate />
        </Route>
        <Route path="/lists/:id/info">
          <ListInfo />
        </Route>
        <Route path="/lists/:id">
          <Lists />
        </Route>
        <Route path="/lists">
          <AllLists />
        </Route>
        <Route path="/media/temp/:id">
          <TempMedia />
        </Route>
        <Route path="/media/:id">
          <Media />
        </Route>
        <Route path="/media">
          <AllMedia />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </>
  );
}

export default App;
