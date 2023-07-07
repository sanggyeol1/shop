import './App.css';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Navbar, Container, Nav, Row, Col } from 'react-bootstrap';
import bg from './img/에어포스1.jpg'
import {data} from './data.js';
import { Routes, Route, Link, useNavigate, Outlet, json } from 'react-router-dom'
import Detail from './routes/Detail.js'
import Cart from './routes/Cart.js'
import axios from 'axios'
import { useQuery } from "react-query"



function App() {

  useEffect(()=>{
    let storedData = localStorage.getItem('watched')

    if(!storedData){
      localStorage.setItem('watched', JSON.stringify( [] ))
    }//이미 값이 있으면 []를 추가하지 않음(새로고침 시 로컬스토리지 초기화 안댐)
    
  },[])



  let obj = {name : 'kiddm'}
  localStorage.setItem('data', JSON.stringify(obj))//오브젝트 그냥 넣으면 깨짐 -> JSON을 이용해서 저장
  let 꺼낸거 = localStorage.getItem('data')
  //꺼낼때도JSON임 -> 꺼낸거.name 이런식으로 사용할 수 없음 -> 파싱을 해줌 -> 사용 가능



  let [shoes, setShoes] = useState(data);
  let [재고] = useState([10,11,12])
  let navigate = useNavigate();
  let [load, setLoad] = useState();
  let [clickCount, setClickCount] = useState(0)
  let [noData, setNoData] = useState(false)


  //장점1. 성공/실패/로딩중 쉽게 파악 가능함 ex)result.data, 장점2. 틈만나면 refatch해줌, 
  //장점3. 실패 시 retry해줌, 장점4. state공유 안해도 됨
  //장점4. 결과 캐싱 가능(기존의 ajax성공 결과를 미리 보여준 후 ajax를 하여 빠른 느낌을 줌)
  let result = useQuery('작명', ()=>{
    return(
      axios.get('https://codingapple1.github.io/userdata.json').then((a)=>{
        console.log('요청됨')
        return a.data
      })
    )
  })


  
  return (
    <div className="App">

      <Navbar bg="" variant="" className="nav-bar">
        <Container>
          <Navbar.Brand href="#home">ShoeShop</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link className='nav-menu' onClick={()=>{ navigate('/') }}>Home</Nav.Link>
            <Nav.Link className='nav-menu' onClick={()=>{ navigate('/cart') }}>Cart</Nav.Link>
            <Nav.Link className='nav-menu' onClick={()=>{ navigate(-1) }}>뒤로</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            { result.isLoading && '로딩중'}
            { result.error && '에러'}
            { result.data && result.data.name }
          </Nav>
        </Container>
      </Navbar>

      <Routes>
        <Route path="/" element={
         <> 
          <div className="main-bg" style={{backgroundImage : 'url('+ bg +')'}}></div>
          <Container>
          <Row>
            {
              shoes.map(function(a, i){
                return(
                  <Card shoes={shoes} i={i}></Card>
                )
              })
            }
          </Row>
          
        </Container> 
        {
          load == true ? <Loading/> : null
        }
        {
          noData == true ? <NoData/> : null
        }
        <button onClick={()=>{
          setLoad(true)
          if(clickCount == 0){
            axios.get('https://codingapple1.github.io/shop/data2.json')
            .then((결과)=>{
              let copy = [...shoes, ...결과.data]
              setShoes(copy);
              setLoad(false)
              setClickCount(clickCount+1)
          })
            //get요청 실패 시
            .catch(()=>{
            console.log('실패함 ㅅㄱ')
            })
          }else if(clickCount == 1){
            axios.get('https://codingapple1.github.io/shop/data3.json')
            .then((결과)=>{
              let copy = [...shoes, ...결과.data]
              setShoes(copy);
              setLoad(false)
              setClickCount(clickCount+1)
          })
            //get요청 실패 시
            .catch(()=>{
            console.log('실패함 ㅅㄱ')
            })
          }else{
            setLoad(false)
            setNoData(true)
          }

        }}> 더보기 </button>
        </>
        }/>


        <Route path="*" element={<div>없는 페이지에요</div>} />
        {/* url파라미터 */}
        <Route path="/detail/:id" element={<Detail shoes={shoes}/>}/>
        
        <Route path="/cart" element={<Cart/>} />

        

        <Route path="/about" element={<About/>}>
          <Route path="member" element={<div>멤버임</div>}></Route>
          <Route path="location" element={<div>위치정보임</div>}></Route>
        </Route>

      </Routes>
    </div>
  );
}


function About(){
  return(


    <div>
      <h4>회사정보임</h4>
      <Outlet></Outlet>
    </div>
  )
}

function Card(props){
  let shoeImage = [
    "https://codingapple1.github.io/shop/shoes1.jpg",
    "https://codingapple1.github.io/shop/shoes2.jpg",
    "https://codingapple1.github.io/shop/shoes3.jpg",
    "https://codingapple1.github.io/shop/shoes4.jpg",
    "https://codingapple1.github.io/shop/shoes5.jpg",
    "https://codingapple1.github.io/shop/shoes6.jpg",
    "https://codingapple1.github.io/shop/shoes7.jpg",
    "https://codingapple1.github.io/shop/shoes8.jpg",
    "https://codingapple1.github.io/shop/shoes9.jpg",
  ]
  let navigate = useNavigate()
  return(
    <Col sm>
      <img onClick={()=>{
        navigate('/detail/'+props.i)
      }} src={shoeImage[props.i]} width="80%"></img>
      <h4>{props.shoes[props.i].title}</h4>
      <p>{props.shoes[props.i].content}</p>
      <p>{props.shoes[props.i].price}</p>
    </Col>
  )
}

function Loading(props){
  return(
    <div className='alert alert-warning'>
      Loading ...
    </div>
  )
}
function NoData(props){
  return(
    <div className='alert alert-warning'>
      There Is No Data
    </div>
  )
}






export default App;
