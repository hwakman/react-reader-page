import React, { Component,Fragment } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Loader from 'react-loading';
import './App.css';
import Axios from 'axios';

const Paper = (props) => {
  return(
    <span className="bg-light col-sm col-lg-8 shadow paper">
    <p className="d-flex"><small>({props.id})</small> {props.title}</p>
    <p><small>{props.content}</small></p>
    </span>
  )
}

class App extends Component {
  constructor(){
    super();
    this.state = {
      isClickMenu: true,
      show: false,
      fullVal: [],
      fillVal: [],
      perPageNo: [5,10,15,25,50],
      pageNo : null,
      perpage : 5,
      stPage: 0,
      edPage: 0,
      loading: true
    }
    this.topBut = React.createRef;
    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
    this.lastPage = this.lastPage.bind(this);
    this.firstPage = this.firstPage.bind(this);
    this.isSelected = this.isSelected.bind(this);
  }

  toggleShow = () => {
    if(this.state.isClickMenu){
      this.backToTop();
    }
    this.setState(
      {
        show:!this.state.show,
        isClickMenu:!this.state.isClickMenu
      }
    );
  }
  stopLoading(){
    setTimeout(() => {
      this.setState({loading:false})
    },850);
  };

  reload(){
    Axios.get('https://jsonplaceholder.typicode.com/posts').then(
      res => {
        this.setState({fullVal:res.data,loading:true});
      }
    ).then(
      () => {
        this.setState({fillVal:this.state.fullVal.filter(data => (
          this.state.stPage < data.id && 
          data.id <= (this.state.edPage+this.state.perpage)
        ))});
        this.stopLoading();
        console.log(
          this.state.stPage,
          this.state.edPage
        );
      }
    );
  }

  nextPage(){
    const allpage = this.state.fullVal.length;
    const setEd = allpage-this.state.perpage;
    if((this.state.edPage+this.state.perpage) < allpage){
      this.setState({stPage:this.state.stPage+this.state.perpage,edPage:this.state.edPage+this.state.perpage});
      this.reload();
    }else{
      this.setState({
        stPage:allpage-this.state.perpage,
        edPage:setEd
      });
    }
  }

  lastPage(){
    const allpage = this.state.fullVal.length;
    const setEd = allpage-this.state.perpage;
    this.setState({
      stPage:allpage-this.state.perpage,
      edPage:setEd
    });
    this.reload();
  }

  prevPage(){
    if((this.state.stPage-this.state.perpage) >= 0){
      this.setState({stPage:this.state.stPage-this.state.perpage,edPage:this.state.edPage-this.state.perpage});
      this.reload();
    }else{
      this.setState({
        stPage:0,
        edPage:0,
      })
      this.reload();
    }
  }

  firstPage(){
    this.setState({
      stPage:0,
      edPage:0,
    })
    this.reload();
  }

  backToTop(){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  perpageChange = e => {
    const allPage = this.state.fullVal.length;
    const maxVal = parseInt(e.target.value)+this.state.edPage;
    if(maxVal > allPage){
      this.setState({
        perpage:parseInt(e.target.value),
        edPage: allPage,
        stPage: allPage-parseInt(e.target.value)
      });
      this.reload();
    }else{
      this.setState({
        perpage:parseInt(e.target.value)
      });
      this.reload();
    }

  }
  isSelected = e => {
    return e === this.state.perpage;
  }

  componentDidMount(){
    this.reload();
  }

  render() {
    return (
      <Fragment>
        {this.state.loading ?
        <div className="bg-dark d-flex justify-content-center align-items-center text-light" style={{width:'100vw',height:"100vh"}}>
          <Loader type="cylon" color="#fff" height={'20%'} width={'20%'} title="loading" />
        </div>
        :
        <div>
          <div className="topNav bg-dark shadow fixed-top col">
          <button className="btn btn btn-dark" onClick={this.toggleShow}>
            <b>menu <i className={this.state.isClickMenu ? "fas fa-chevron-right":"fas fa-chevron-left"} /></b>
          </button>
        </div>

        <span className={this.state.show ? 'show' : 'notShow'}>
          <div className="sideMenu list-group bg-secondary text-white shadow">
            <span className="btn btn-secondary btn-lg"><b>Today News</b></span>
            <span className="btn btn-secondary btn-lg"><b>Technology</b></span>
            <span className="btn btn-secondary btn-lg"><b>Sport</b></span>
            <span className="btn btn-secondary btn-lg"><b>Space</b></span>
            <span className="btn btn-secondary btn-lg"><b>Art</b></span>
            <span className="btn btn-secondary btn-lg"><b>About</b></span>
          </div>
        </span>

        <div className="container-fluid content">

          <div className="row justify-content-center">
              <span className="paper shadow-sm col-sm col-lg-8">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <label className="input-group-text"><b>Show</b></label>
                  </div>
                  <select className="custom-select" onChange={this.perpageChange}>
                    {this.state.perPageNo.map((data,key) =>
                    <option value={data} selected={this.isSelected(data)} key={key}>{data}</option>
                    )}
                  </select>
                </div>
              </span>
          </div>

          {this.state.fillVal.map((data,key) => 
            <span className="row justify-content-center" key={key}>
              <Paper title={data.title} content={data.body} id={data.id} />
            </span>  
          )}
          <div className="row justify-content-center">
              <span className="paper col shadow-sm col-sm col-lg-8">
                <span>
                  <button onClick={this.firstPage} className="btn-light btn"><b><i className="fas fa-chevron-left" /><i className="fas fa-chevron-left" /> Frist</b></button>{' '}
                  <button onClick={this.prevPage} className="btn-light btn"><b><i className="fas fa-chevron-left" /> Prev</b></button>
                </span>
                <span style={{float:"right"}}>
                  <button onClick={this.nextPage} className="btn-light btn"><b>Next <i className="fas fa-chevron-right"/></b></button>{' '}
                  <button onClick={this.lastPage} className="btn-light btn"><b>Last <i className="fas fa-chevron-right"/><i className="fas fa-chevron-right"/></b></button>
                </span>
              </span>
          </div>
        </div>
        <button onClick={this.backToTop} id="topBut" className="topBut btn btn-sm btn-dark notShow">TOP</button>
        </div>
        }
      </Fragment>
    );
  }
}

export default App;
