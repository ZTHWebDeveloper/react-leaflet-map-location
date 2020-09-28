import React, { Component } from 'react'
import axios from 'axios'
import {
  Marker,
  Map,
  Polygon,
  Popup,
  TileLayer,

} from 'react-leaflet';

const polygon = [
  [16.964705, 96.050054],
  [16.822009, 96.114912],
  [16.884450, 95.960803],
]


export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      center: { lat: 16.896054, lng: 96.053319 },
      currentLocation: { lat: 16.777751, lng: 96.144640 },
      zoom: 12,
      search: '',
      locations: [],
    }
    this.handleChange = this.handleChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }


  handleClick(e) {
    console.log(e)
    const {lat,lng} = e.latlng
    axios.get(`http://localhost:3100/search/?lat=${lat}&lon=${lng}`)
          .then(response=>{
            this.setState({ locations: response.data }, () => {
              console.log(this.state.locations)
            })
          })
          .catch(err=>{
            console.log(err)
          })

  }


  handleChange(e) {
    this.setState({ search: e.target.value })
  }
  onSubmit(e) {
    e.preventDefault();
    const searchName = this.state.search

    axios.get(`http://localhost:3100/search/${searchName}`)
      .then(response => {
        this.setState({ locations: response.data }, () => {
          console.log(this.state.locations)
        })

      })
      .catch(err => {
        console.log(err)
      })
  }
  render() {

    const { center, zoom, locations } = this.state;
    return (
      <div>
        <div>
          <form onSubmit={this.onSubmit}>
            <input type="text" name="search" onChange={this.handleChange} />
            <button>Search by</button>
          </form>

        </div>
        <Map center={center} zoom={zoom}>

          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polygon color="purple" positions={polygon} />
          {
            locations.length ?
              locations.map(locat =>
                <Marker position={locat.Location} onClick={this.handleClick}>
                  <Popup>
                    {locat.Search_Name}
                  </Popup>
                </Marker>

              )
              : null
          }
        </Map>
      </div>

    )
  }
}