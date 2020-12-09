import Livefeed from "./pages/livefeed"
import Storedinfo from "./pages/storedinfo"
import { BrowserRouter as Router, Route} from "react-router-dom";
import Navbar from "./navbar"
import 'semantic-ui-css/semantic.min.css'

function App() {

  return (
    
    <div>


<Router>
<Navbar></Navbar>
<br/>
<Route path="/"  exact render={(props) =>{ 
      return <Livefeed/>
      } 
    }/>

<Route path="/readings"  exact render={(props) =>{ 
      return <Storedinfo/>
      } 
    }/>

</Router>



    </div>
  );
}

export default App;
