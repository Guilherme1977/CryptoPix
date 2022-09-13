import { useState } from "react";
import { ethers, BigNumber } from "ethers";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import roboPunksNFT from "./RoboPunksNFT.json";
import { ConsoleSqlOutlined, LoadingOutlined, UserAddOutlined } from '@ant-design/icons'
import { Spin, Row, Col } from "antd";
var axios = require('axios');


const MaintMint = ({ accounts, setAccounts }) => {
  const [mintAmount, setMintAmount] = useState(1);
  const isConnected = Boolean(accounts[0]);
  const [isMinting, setIsMinting] = useState(false);
  const [confirmTrans, setConfirmTrans] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const[CPF, setCPF] = useState();
  const [reais, setReais] = useState();
  const [amountMatic, setAmountMatic] = useState();
  const [theUser, setUser] = useState('');

  async function chamadaAPI(user) {
    //e.preventDefault();
    setIsMinting(true)
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log(provider)
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      var data = JSON.stringify({
        "quantity": mintAmount.toString(),
        "metamask": address,
        "name": title,
        "email": body,
        "user": theUser,
        "cpf": CPF,
        "quantity": reais
      });
      
      var config = {
        method: 'post',
        url: 'https://parseapi.back4app.com/functions/swapPix',
        headers: { 
          'X-Parse-Application-Id': 'mpxuNMEJnSlytSS75jhHdt4O3bCpxgRr6glWHnKw', 
          'X-Parse-REST-API-Key': 'Spj9NomBOJYsPp2Dh4QFfKjcKIDXOYUhqCONK7AH', 
          'Content-Type': 'application/json'
        },
        data : data
      };
      
      await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data.result.charge.paymentLinkUrl));
        window.location.replace(response.data.result.charge.paymentLinkUrl);
      })
      .catch(function (error) {
        console.log(error);
      });

    }


  }

  function cancel() {
    setConfirmTrans(false)
  }

  function test() {
    console.log(CPF)
  }

  async function verifyUser() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log(provider)
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    var data = JSON.stringify({
      "quantity": mintAmount.toString(),
      "metamask": address,
      "name": title,
      "email": body,
      "amount": reais
    });
    
    var config = {
      method: 'post',
      url: 'https://parseapi.back4app.com/functions/verificarUsuario',
      headers: { 
        'X-Parse-Application-Id': 'mpxuNMEJnSlytSS75jhHdt4O3bCpxgRr6glWHnKw', 
        'X-Parse-REST-API-Key': 'Spj9NomBOJYsPp2Dh4QFfKjcKIDXOYUhqCONK7AH', 
        'Content-Type': 'application/json'
      },
      data : data
    };
    var final
    await axios(config)
    .then(function (response) {
      final = response.data.result;
    })
    .catch(function (error) {
      return(error);
    });
    
    return(final)
  }

  async function criarUser() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log(provider)
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    var data = JSON.stringify({
      "quantity": mintAmount.toString(),
      "metamask": address,
      "name": title,
      "email": body,
      "cpf": CPF,
      "amount": reais
    });
    
    var config = {
      method: 'post',
      url: 'https://parseapi.back4app.com/functions/criarUsuario',
      headers: { 
        'X-Parse-Application-Id': 'mpxuNMEJnSlytSS75jhHdt4O3bCpxgRr6glWHnKw', 
        'X-Parse-REST-API-Key': 'Spj9NomBOJYsPp2Dh4QFfKjcKIDXOYUhqCONK7AH', 
        'Content-Type': 'application/json'
      },
      data : data
    };
    var final
    await axios(config)
    .then(function (response) {
      console.log("User criado:" + response.data)
    })
    .catch(function (error) {
      return(error);
    });
    
    return(final)

  }

  async function master() {

    if(body.includes("@") == false || body.includes(".") == false){
      alert("Por favor, ensira um e-mail válido")
     }
     if(body == '' || title == '' || CPF == '' || reais == ''){
      alert("Por favor, preencha todos os campos")
     }
     if(body.includes("@") && title !== '' && body.includes(".") && CPF !== '' && reais !== ''){
      const result = await verifyUser().then(async function (response) {
        if(response){
          console.log("user existe!!")
          
        }
        else{
          console.log("user não existe")
          await criarUser()
        }
    });

    const handle = await handleMint();
      }



  }

async function getUser() {

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  console.log(provider)
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  await setUserAddress(address);

  var data = JSON.stringify({
    "quantity": mintAmount.toString(),
    "metamask": address,
    "name": title,
    "email": body,
    "amount": reais
  });
  
  var config = {
    method: 'post',
    url: 'https://parseapi.back4app.com/functions/verificarUsuario',
    headers: { 
      'X-Parse-Application-Id': 'mpxuNMEJnSlytSS75jhHdt4O3bCpxgRr6glWHnKw', 
      'X-Parse-REST-API-Key': 'Spj9NomBOJYsPp2Dh4QFfKjcKIDXOYUhqCONK7AH', 
      'Content-Type': 'application/json'
    },
    data : data
  };
  var user;
  await axios(config)
  .then(function (response) {
    console.log((response.data.result.objectId));
    user = response.data.result.objectId;
  })
  .catch(function (error) {
    console.log(error);
  });

  return(user)

}


  async function handleMint() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log(provider)
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      await setUserAddress(address);
      if(body.includes("@") && title !== '' && body.includes(".")){
      var user1 = await getUser(address);
      setUser(user1);
      console.log(accounts[0])
      setIsMinting(true)
      
      //chamadno api para calcular taxa:

      var data = JSON.stringify({
        "quantity": mintAmount.toString(),
        "metamask": address,
        "name": title,
        "email": body,
        "amount": reais
      });
      
      var config = {
        method: 'post',
        url: 'https://parseapi.back4app.com/functions/calcularTaxa',
        headers: { 
          'X-Parse-Application-Id': 'mpxuNMEJnSlytSS75jhHdt4O3bCpxgRr6glWHnKw', 
          'X-Parse-REST-API-Key': 'Spj9NomBOJYsPp2Dh4QFfKjcKIDXOYUhqCONK7AH', 
          'Content-Type': 'application/json'
        },
        data : data
      };
      
      await axios(config)
      .then(function (response) {
        setAmountMatic(response.data.result)
        setIsMinting(false)
        setConfirmTrans(true)
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });

    }
      
            /*
      const contract = new ethers.Contract(
        roboPunksNFTAddress,
        roboPunksNFT.abi,
        signer
      );
      try {
        const response = await contract.mint(BigNumber.from(mintAmount), {
            value: ethers.utils.parseEther((0.02 * mintAmount).toString()),
        });
        console.log("response: ", response);
      } catch (err) {
        console.log("error: ", err);
      }
      */
     if(body.includes("@") == false || body.includes(".") == false){
      alert("Por favor, ensira um e-mail válido")
     }
     if(body == '' || title == '' || CPF == '' || reais == ''){
      alert("Por favor, preencha todos os campos")
     }
    }
  }

  const handleDecrement = () => {
    if (mintAmount <= 1) return;
    setMintAmount(mintAmount - 1);
  };

  const handleIncrement = () => {
    if (mintAmount >= 3) return;
    setMintAmount(mintAmount + 1);
  };

  const handleCPF = (e) => {
    if(e.target.value>='0' && e.target.value<='9' && isNaN(e.target.value) == false && e.target.value != "," || e.target.value == '') setCPF(e.target.value);
  }

  const handleReais = (e) => {
    if(e.target.value>='0' && e.target.value<='9' && isNaN(e.target.value) == false || e.target.value == '') {
      var tt = e.target.value.replace(/,/g, '.')
      setReais(tt);
      console.log(reais);
    }
  }

  if (isMinting == true){
    return(<div>
      <h1>Carregando </h1>
      <span><Spin indicator={<LoadingOutlined style={{ fontSize: 100 }} spin />} /></span>
    </div>)}

  if (confirmTrans == true) {
    return (
      <Flex justify="center" align="center" height="100vh" paddingBottom="350px" lineHeight="50px">
        <Box width="1200px">
          <h1>Você irá receber de {(amountMatic[0] / 10**18).toFixed(2)} à {(amountMatic[1] / 10**18).toFixed(2)} matics para a carteira {accounts[0]}</h1>
          <h2>Total de R${reais}</h2>
          <Button
              backgroundColor="red"
              borderRadius="5px"
              boxShadow="0px 2px 2px 1px #0F0F0F"
              color="white"
              cursor="pointer"
              fontFamily="inherit"
              padding="15px"
              margin="10"
              onClick={cancel}
            >
              Cancelar
            </Button>
          <Button
              backgroundColor="#008fd4"
              borderRadius="5px"
              boxShadow="0px 2px 2px 1px #0F0F0F"
              color="white"
              cursor="pointer"
              fontFamily="inherit"
              padding="15px"
              margin="10"
              onClick={chamadaAPI}
            >
              Confirmar
            </Button>
        </Box>
    </Flex>


    )
  }
  return (
    <Flex justify="center" align="center" height="100vh" paddingBottom="350px">
      <Box width="1200px">
        <div>
          <Text fontSize="48px" textShadow="0 5px #000000">
            CryptoPix
          </Text>
          <Text
            fontSize="30px"
            letterSpacing="-5.5%"
            fontFamily="VT323"
            textShadow="0 2px 2px #000000"
          >
            Criptomoedas na sua metamask diretamente com Pix
          </Text>
        </div>

        {isConnected ? (
          <div>
            <form>
                <input 
                  type="text" 
                  required
                  placeholder="Nome" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: "350px", height:"35px", fontFamily: "inherit"}}
                />
                <div>
                <div>
                  <input 
                  type="email" 
                  required 
                  placeholder="Email"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  style={{ width: "350px", height:"35px", fontFamily: "inherit", marginTop: "15px"}}
                />
                </div>
                <div>
                  <input 
                  type="text" 
                  required 
                  placeholder="CPF"
                  value={CPF}
                  onChange={handleCPF}
                  style={{ width: "350px", height:"35px", fontFamily: "inherit", marginTop: "15px"}}
                />
                </div>
                <div style={{marginBottom: "15px"}}>
                  <input 
                  type="text" 
                  required 
                  placeholder="Quantidade de reais"
                  value={reais}
                  onChange={handleReais}
                  style={{ width: "350px", height:"35px", fontFamily: "inherit", marginTop: "15px"}}
                />
                </div>
                </div>
            </form>
            <Button
              backgroundColor="#008fd4"
              borderRadius="5px"
              boxShadow="0px 2px 2px 1px #0F0F0F"
              color="white"
              cursor="pointer"
              fontFamily="inherit"
              padding="15px"
              margin="10"
              onClick={master}
              //aqui é a função "master"
            >
              Realizar compra de MATIC
            </Button>
          </div>
        ) : (
          <Text
            marginTop="70px"
            fontSize="30px"
            letterSpacing="5.5%"
            fontFamily="VT323"
            textShadow="0 3px #000000"
            color="#008fd4"
          >
            Connect your wallet to swap.
          </Text>
        )}
      </Box>
    </Flex>
  );
};

export default MaintMint;
