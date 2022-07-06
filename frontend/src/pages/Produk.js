import React from "react"
import axios from "axios"
import { Modal } from "bootstrap/dist/js/bootstrap.bundle";
import { product_image_url } from "../component/config";
import Navbar from "../component/Navbar"
import "./Produk.css";


export default class Produk extends React.Component{
    constructor(){
        super()
        this.state = {
            product : [],
            nama : "",
            harga : 0,
            stok : 0,
            deskripsi : "",
            foto : "",
            id_produk: "",
            uploadFile: true,
            showdetail: false,
            action: ""
        }
    }
    getProduct = () => {
        let url = `http://localhost:7880/store/api/v1/produk/`
        axios.get(url)
        .then(response=> {
            this.setState({product: response.data})
            console.log(this.state.product)
        })
        .catch(error => {
            if (error.response) {
                if(error.response.status) {
                    window.alert(error.response.data.message)
                }
            }else{
                console.log(error);
            }
        })
    }
    componentDidMount(){
        this.getProduct()
    }

    dropProduct = selectedItem => {
        if (window.confirm("Yakin mau dihapus ?")) {
            let url = `http://localhost:7880/store/api/v1/produk/` + selectedItem.id_produk
            axios.delete(url)
            .then(response => {
                window.alert(response.data.message)
                this.getProduct()
            })
            .catch(error => console.log(error))
        }
    }

    tambahData() {
        //Memunculkan Modal
        this.modalProduk = new Modal(document.getElementById("tambah-modal"))
        this.modalProduk.show()

        //Mengosongkan input
        this.setState({
            id_produk: 0, 
            nama: "", 
            harga: 0, 
            stok: 0, 
            deskripsi: "", 
            foto: null, 
            uploadFile: true, 
            action: "tambah"
        })
    }

    ubahData (id_produk ) {
        this.modalProduk = new Modal(document.getElementById("tambah-modal"))
        this.modalProduk.show()
        let index = this.state.product.findIndex((produk) => produk.id_produk === id_produk)

        this.setState({
            id_produk : this.state.product[index].id_produk,
            nama : this.state.product[index].nama,
            harga : this.state.product[index].harga,
            stok : this.state.product[index].stok,
            deskripsi : this.state.product[index].deskripsi,
            foto: null,
            action : "ubah",
            
        })
       
    }

    simpanData(ev) {
        ev.preventDefault() // untuk mencegah berjalannya aksi default dari form submit

        //Menghilangkan modal
        this.modalProduk.hide()

          //Menampung data
          let form = new FormData()
          form.append("id_produk", this.state.id_produk)
          form.append("nama", this.state.nama)
          form.append("harga", this.state.harga)
          form.append("stok", this.state.stok)
          form.append("deskripsi", this.state.deskripsi)
  
          if (this.state.uploadFile) {
              form.append("foto", this.state.foto)
          }
        //cek aksi tambah atau ubah
        if (this.state.action === "tambah"){
            let endpoint = `http://localhost:7880/store/api/v1/produk`
          
            axios.post(endpoint, form)
            .then(response => {
                window.alert(response.data.message)
                this.getProduct()
            })
            .catch(error => console.log(error))

        }else if (this.state.action === "ubah"){
            
            let endpoint = `http://localhost:7880/store/api/v1/produk/` + this.state.id_produk 
            
            axios.put(endpoint, form)
            .then(response => {
                window.alert(response.data.message)
                this.getProduct()
            })
            .catch(error => console.log(error))
      
      }
    }
    // ViewProduk(id_produk){
    //     this.viewProduk = new Modal(document.getElementById("view-modal"))
    //     this.viewProduk.show()
    // }

    render(){
        return(
            <div>
                <Navbar/>
                <div className="main">
                    <div className="Tambah_produk">
                        <button type="button" class="btn btn-info mb-3" onClick={() => this.tambahData()}>Tambah Produk</button> 
                        <button type="button" class="btn btn-info mb-3 mx-4"  onClick={() => this.setState({showdetail: !this.state.showdetail})} >Tampilkan Dengan Detail</button>
                    </div>
                    <div class="row">
                    {this.state.product.map( item => (
                        <div class="col-lg-4 col-sm-12  ">
                                <div class="card kartu">
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-sm-5 gambar">
                                                <img src={product_image_url + "/" + item.foto} className="img" width={150}></img>
                                            </div>
                                            <div class="col-sm-7">
                                                <h4>{item.nama}</h4>
                                                <button type="button" class="btn btn-warning" onClick={() => this.ubahData(item.id_produk)}>edit </button>
                                                <button type="button" class="btn btn-danger fa fa-bucket mx-3"   onClick={() => this.dropProduct(item)}>delete</button>
                                                <div className={this.state.showdetail ? "d-block" : "d-none "}>
                                                    <div className="judulDetail mt-2"> Detail Produk </div>
                                                    <div className="detail">Stok Barang : {item.stok}</div>
                                                    <div className="detail">Harga Barang : {item.harga}</div>
                                                    <div className="detail">Deskripsi : {item.deskripsi}</div>
                                                </div>
                                           </div>
                                        </div>   
                                    </div>
                                </div>                
                        </div>
                        ))}
                    </div>
                    <div className="modal fade" id="tambah-modal" tabindex="-1" aria-labelledby="tambah-modal-label" aria-hidden="true">
                        <div className="modal-dialog modal-md">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className="modal-title text-center ">
                                        <i class="fa-solid fa-box-open rounded text-primary"></i>
                                        <h5 className="mb-4 mt-3" id="tambah-modal-label">Data Produk</h5>
                                    </div>
                                    <form onSubmit={ev => this.simpanData(ev)}>
                                        <div className="form-group">
                                            <label>Nama</label>
                                            <input type="text" className="form-control mb-3" value={this.state.nama} onChange={ev => this.setState({nama: ev.target.value})} required></input>
                                        </div>
                                        <div className="form-group">
                                            <label>Harga</label>
                                            <input type="text" className="form-control mb-3" value={this.state.harga} onChange={ev => this.setState({harga: ev.target.value})}></input>
                                        </div>
                                        <div className="form-group">
                                            <label>Stok</label>
                                            <input type="text" className="form-control mb-3" value={this.state.stok} onChange={ev => this.setState({stok: ev.target.value})}></input>
                                        </div>
                                        <div className="form-group">
                                            <label>Deskripsi</label>
                                            <textarea class="form-control mb-3" value={this.state.deskripsi} onChange={ev => this.setState({deskripsi: ev.target.value})} rows="3"></textarea>
                                        </div>
                                        <div className="form-group">
                                            <label>Foto</label>
                                            <input type="file" className="form-control mb-3" onChange={ev => this.setState({foto: ev.target.files[0]})}></input>
                                        </div>
                                        <div className="text-center mt-5">
                                            <button type="button" class="btn btn-light btn-sm mx-2 px-3 py-2" data-bs-dismiss="modal">Batal</button>
                                            <button type="submit" className="btn btn-primary text-white btn-sm px-3 py-2">Simpan</button>
                                        </div>                                    
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
