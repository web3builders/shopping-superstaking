// Admin address (to see Admin panel)
var adminAddress = "0x8D65Df3f0f5FaB4A997713FAa905Fa906ACE4c82"

// Ethereum mainNet staking contract
// https://etherscan.io/address/0xfF28be45238778Db4082645A4665f3e6FbEbec25#code
var stakingContract = "0xfF28be45238778Db4082645A4665f3e6FbEbec25"

// Ethereum mainNet $SPI token contract
var SPIContract = "0x9b02dd390a603add5c07f9fd9175b7dabe8d63b7"

// Binance Smart Chain staking contract
// https://bscscan.com/address/0xb5C8fa958Cd4E0b9f465269459Eb28fd3fc21D2b#code
var stakingContractOnBinanceChain = "0xb5C8fa958Cd4E0b9f465269459Eb28fd3fc21D2b"

// Binance Smart Chain $GSPI contract
var GSPIContract = "0xB42e1c3902b85b410334f5fff79cDc51fBeE6950"

/******************************************************************************/

var web3,
    accounts,
    Stake,
    Token,
    chainID,
    path  = "",
    notif = new Audio("notif.wav"),
    click = new Audio("click.wav"),
    error = new Audio("error.wav")

var User = {
    "address": "",
    "balance": "",
    "b_inwei": "",
    "shares": "",
    "s_inwei": "",
    "dividends": "",
    "weight": "",
    "allowed": false,
    "stakeAll": false,
    "unstakeAll": false
}

var Contract = {
    "balance" : "",
    "shares"  : "",
    "holders" : "",
    "ref"     : "0xf14ea16a456617dAb1645ef79f9d0b2Bf1BF010B",
    "usdvalue": "",
    "fee"     : 0
}

var fetchStakingLoop

$(window).on("load", function() {
    $(".loadingscreen").fadeOut(1000)
})

$(document).ready(function() {
    $(".connectwallet, .adminpanel, .enabletoken").css({
        "position": "absolute",
        "top": "calc(50% - " + ($(".connectwallet").outerHeight() / 2) + "px)",
        "left": "calc(50% - " + ($(".connectwallet").outerWidth() / 2) + "px)"
    })

    if (window.localStorage.getItem("connected")) {
        connect()
    }
    $("#Connect").click(function() {
        connect()
    })

    $("#stakeAll").click(function() {
        if (User.balance > 0) {
            User.stakeAll = true
            $("#depositInput").val(parseFloat(web3.utils.fromWei(User.b_inwei)))
            
            let val = parseFloat($("#depositInput").val())
            let amt = val - (val * Contract.fee / 100)
            $("#sharesToGet").text(toFixed(amt, 2))
        }
    })

    $("#unstakeAll").click(function() {
        if (User.shares > 0) {
            User.unstakeAll = true
            $("#sellInput").val(parseFloat(web3.utils.fromWei(User.s_inwei)))
            
            let val = parseFloat($("#sellInput").val())
            let amt = val - (val * Contract.fee / 100)
            $("#amtFromSell").text(toFixed(amt, 2))
        }
    })

    $("input").on("input", function() {
        User.stakeAll = false
        User.unstakeAll = false
        let val = parseFloat($(this).val())
        if (val > 0) {
            let amt = val - (val * Contract.fee / 100)
            switch ($(this).attr("id")) {
                case "depositInput":
                    $("#sharesToGet").text(toFixed(amt, 2))
                    break;
                case "sellInput":
                    $("#amtFromSell").text(toFixed(amt, 2))
                    break;
            }
        }
    })

    $("body").on("click", "#enableToken", function() {
        enableToken()
        click.play()
    })

    $(".deposit").on("click", "#depositToken", function() {
        if(User.allowed) {
            let value = parseFloat($("#depositInput").val())
            if (value > 0) {
                if (User.stakeAll) {
                    stake(User.b_inwei, Contract.ref)
                    click.play()
                    return;
                }
                if (value <= parseFloat(User.balance)) {
                    stake(web3.utils.toWei(value.toString()), Contract.ref)
                    click.play()
                } else {
                    $(".deposit").addClass("shake")
                    setTimeout(function() {
                        $(".deposit").removeClass("shake")
                    }, 300)
                    error.play()
                }
            } else {
                $(".deposit").addClass("shake")
                setTimeout(function() {
                    $(".deposit").removeClass("shake")
                }, 300)
                error.play()
            }
        } else {
            $(".enabletoken").css("display", "flex")
        }
    })

    $(".unstake").on("click", "#sellToken", function() {
        let value = parseFloat($("#sellInput").val())
        if (value > 0) {
            if (User.unstakeAll) {
                unstake(User.s_inwei)
                click.play()
                return;
            }
            if (value <= parseFloat(web3.utils.fromWei(User.shares))) {
                unstake(web3.utils.toWei(value.toString()))
                click.play()
            } else {
                $(".unstake").addClass("shake")
                setTimeout(function() {
                    $(".unstake").removeClass("shake")
                }, 300)
                error.play()
            }
        } else {
            $(".unstake").addClass("shake")
            setTimeout(function() {
                $(".unstake").removeClass("shake")
            }, 300)
            error.play()
        }
    })

    $(".extended").on("click", "#withdrawDividends", function() {
        if (parseFloat(web3.utils.fromWei(User.dividends)) > 0) {
            withdraw()
            click.play()
        } else {
            $(".extended").addClass("shake")
            setTimeout(function() {
                $(".extended").removeClass("shake")
            }, 300)
            error.play()
        }
    })

    $(".extended").on("click", "#reinvestDividends", function() {
        if (parseFloat(web3.utils.fromWei(User.dividends)) > 0) {
            reinvest()
            click.play()
        } else {
            $(".extended").addClass("shake")
            setTimeout(function() {
                $(".extended").removeClass("shake")
            }, 300)
            error.play()
        }
    })

    $(".adminpanel").on("click", ".close", function() {
        $(".adminpanel").hide()
        click.play()
    })

    $(".adminpanel").on("click", "#adminDepositToken", function() {
        let value = parseFloat($("#adminDepositInput").val())
        if (value > 0) {
            if (value <= parseFloat(User.balance)) {
                distribute(web3.utils.toWei(value.toString()))
                click.play()
            } else {
                $(".adminpanel").addClass("shake")
                setTimeout(function() {
                    $(".adminpanel").removeClass("shake")
                }, 300)
                error.play()
            }
        } else {
            $(".adminpanel").addClass("shake")
            setTimeout(function() {
                $(".adminpanel").removeClass("shake")
            }, 300)
            error.play()
        }
    })

})

async function connect() {
    try {
        if (window.ethereum) {
            await ethereum.request({
                method: 'eth_requestAccounts'
            })
            web3 = new Web3(ethereum)
            await setup()
            window.ethereum.on("accountsChanged", (accounts) => {
                setup()
            })
            window.ethereum.on('chainChanged', function(networkId) {
                location.reload();
            })
        } else {
            // Non-dapp browser detected
            alert("Non-dapp browser detected. Please install MetaMask!")
        }
    } catch (e) {
        console.error(e)
    }
}

async function setup() {
    try {
        window.localStorage.setItem("connected", true)
        accounts = await web3.eth.getAccounts()
        User.address = accounts[0]
        if (User.address.toLowerCase() == adminAddress.toLowerCase()) {
            $(".adminpanel").css({
                "display": "flex"
            })
        }
        $("#Wallet").empty()
        $("#Wallet").html('<div class="blockie-border"><div class="blockie"></div></div><div class="flex col"><div>Balance</div><div class="flex"><div class="erc20Balance label-small"></div><div class="coin label-small leftright5px"></div></div></div>')
        let blockie = blockies.create({
            seed: accounts[0].toLowerCase()
        }).toDataURL()
        $(".blockie").css("background-image", "url(" + blockie + ")")

        chainID = await web3.eth.getChainId()
        if (chainID == 1) {
            path = "https://etherscan.io/tx/"
            loadSPI()
            refresh($(".coin"), "$SPI")
            refresh($(".sharesLabel"), "$SPIO")
            refresh($(".feeLabel"), "10%")
            Contract.fee = 10
            notify("connect", "Ethereum MainNet", "Wallet connected!", "mainnet")
        } else if (chainID == 56) {
            path = "https://www.bscscan.com/tx/"
            stakingContract = stakingContractOnBinanceChain
            SPIContract = GSPIContract
            loadSPI()
            refresh($(".coin"), "$GSPI")
            refresh($(".sharesLabel"), "$GSPIO")
            refresh($(".feeLabel"), "5%")
            Contract.fee = 5
            notify("connect", "Binance Smart Chain", "Wallet connected!", "binance")
        } else if (chainID == 1337) {
            path = "https://etherscan.io/tx/"
            loadSPI()
            refresh($(".coin"), "$SPI")
            refresh($(".sharesLabel"), "$SPIO")
            refresh($(".feeLabel"), "10%")
            Contract.fee = 10 
            notify("connect", "localhost", "Wallet connected!", "mainnet")
        }
    } catch (e) {
        console.error(e)
    }
}

async function loadSPI() {
    try {
        Token = new web3.eth.Contract(erc20ABI, SPIContract)
        Stake = new web3.eth.Contract(stakingABI, stakingContract)

        if(chainID == 1) {
            await $.get("https://api.coingecko.com/api/v3/simple/price?ids=shopping-io&vs_currencies=usd", function(r) {
                Contract.usdvalue = r["shopping-io"].usd
            })
        }
        else if(chainID == 56) {
            await $.get("https://api.coingecko.com/api/v3/simple/price?ids=gspi&vs_currencies=usd", function(r) {
                Contract.usdvalue = r["gspi"].usd
            })
        }
        else if(chainID == 1337) {
            await $.get("https://api.coingecko.com/api/v3/simple/price?ids=shopping-io&vs_currencies=usd", function(r) {
                Contract.usdvalue = r["shopping-io"].usd
            })
        }

        await fetchTokenData()
        fetchTokenLoop = setInterval(fetchTokenData, 2000)

        await fetchStakingData()
        fetchStakingLoop = setInterval(fetchStakingData, 2000)

        showPanel()
    } catch (e) {
        console.error(e)
    }
}

async function fetchTokenData() {
    try {
        await Token.methods.allowance(User.address, stakingContract).call().then(function(r) {
            if (r > 0) {
                User.allowed = true
                $(".allowanceInput").css({
                    "display": "none"
                })
                $(".deposit, .unstake, .extended, .activestakes").removeClass("disabled")
                $(".enabletoken").hide()
            } else {
                User.allowed = false
                $(".allowanceInput").css({
                    "display": "flex",
                    "flex-direction": "column"
                })
                //$(".deposit, .unstake, .extended, .activestakes").addClass("disabled")
                //$(".enabletoken").css("display", "flex")
            }
        })
        await Token.methods.balanceOf(User.address).call().then(function(r) {
            let balance = toFixed(web3.utils.fromWei(r), 4)
            if (User.balance !== balance) {
                User.balance = balance
                User.b_inwei = r
                refresh($(".erc20Balance"), balance)
            }
        })
        await Token.methods.balanceOf(stakingContract).call().then(function(r) {
            if (Contract.balance !== r) {
                Contract.balance = r
                refresh($(".contractBalance"), Number(toFixed(web3.utils.fromWei(Contract.balance), 4)).toLocaleString())
                refresh($(".contractBalanceInUSD"), Number(toFixed((parseFloat(web3.utils.fromWei(Contract.balance)) * Contract.usdvalue), 4)).toLocaleString())
            }
        })
    } catch (e) {
        console.error(e)
    }
}

async function fetchStakingData() {
    try {
        await Stake.methods.multiData().call({
            from: User.address
        }).then(function(r) {
            if (Contract.shares !== r[1]) {
                Contract.shares = r[1]
                refresh($(".totalSharesBalance"), Number(toFixed(parseFloat(web3.utils.fromWei(Contract.shares)), 4)).toLocaleString())
            }
            if (User.shares !== r[2]) {
                User.shares = r[2]
                User.s_inwei = r[2]
                refresh($(".userShares"), toFixed(parseFloat(web3.utils.fromWei(User.shares)), 4))
            }
            if (User.dividends !== r[4]) {
                User.dividends = r[4]
                refresh($(".dividends"), toFixed(parseFloat(web3.utils.fromWei(User.dividends)), 6))
            }
        })
        await Stake.methods.totalHolder().call().then(function(r) {
            if (Contract.holders !== r) {
                Contract.holders = r
                refresh($(".totalHolder"), Contract.holders)
            }
        })


        User.weight = toFixed(parseFloat(web3.utils.fromWei(User.shares)), 4) * 100 / toFixed(parseFloat(web3.utils.fromWei(Contract.shares)), 4)
        $(".userWeight").text(toFixed(User.weight, 4) + '%')
    } catch (e) {
        console.error(e)
    }
}

async function enableToken() {
    try {
        await Token.methods.approve(stakingContract, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({
                from: User.address
            })
            .on("transactionHash", function(hash) {
                notify("loading", "Approve token", "Pending...", hash)
            })
            .on("receipt", function(receipt) {
                notify("success", "Approve token", "Confirmed!", receipt.transactionHash)
                $(".allowanceInput").hide()
                $(".depositInput").show()
            })
    } catch (e) {
        console.error(e)
    }
}

async function stake(amount, ref) {
    try {
        await Stake.methods.buy(amount, ref).send({
                from: User.address
            })
            .on("transactionHash", function(hash) {
                notify("loading", "Deposit to pool", "Pending...", hash)
            })
            .on("receipt", function(receipt) {
                notify("success", "Deposit to pool", "Confirmed!", receipt.transactionHash)
                $("#depositInput").val("")
                $("#sharesToGet").text("0.00")
            })
    } catch (e) {
        console.error(e)
    }
}

async function unstake(amount) {
    try {
        await Stake.methods.sell(amount).send({
                from: User.address
            })
            .on("transactionHash", function(hash) {
                notify("loading", "Unstake from pool", "Pending...", hash)
            })
            .on("receipt", function(receipt) {
                notify("success", "Unstake from pool", "Confirmed!", receipt.transactionHash)
                $("#sellInput").val("")
                $("#amtFromSell").text("0.00")
            })
    } catch (e) {
        console.error(e)
    }
}

async function withdraw() {
    try {
        await Stake.methods.withdraw().send({
                from: User.address
            })
            .on("transactionHash", function(hash) {
                notify("loading", "Withdraw", "Pending...", hash)
            })
            .on("receipt", function(receipt) {
                notify("success", "Withdraw", "Confirmed!", receipt.transactionHash)
            })
    } catch (e) {
        console.error(e)
    }
}

async function reinvest() {
    try {
        await Stake.methods.reinvest().send({
                from: User.address
            })
            .on("transactionHash", function(hash) {
                notify("loading", "Reinvest", "Pending...", hash)
            })
            .on("receipt", function(receipt) {
                notify("success", "Reinvest", "Confirmed!", receipt.transactionHash)
            })
    } catch (e) {
        console.error(e)
    }
}

async function distribute(amount) {
    try {
        await Stake.methods.distribute(amount).send({
                from: User.address
            })
            .on("transactionHash", function(hash) {
                notify("loading", "Airdrop", "Pending...", hash)
            })
            .on("receipt", function(receipt) {
                notify("success", "Airdrop", "Confirmed!", receipt.transactionHash)
            })
    } catch (e) {
        console.error(e)
    }
}

function notify(type, func, message, hash) {
    let icon, link
    switch (type) {
        case "loading":
            icon = '<i class="fas fa-spinner fa-spin"></i>'
            link = '<a href="' + path + hash + '" target="_blank"><i class="fas fa-external-link-alt"></i></a>'
            break;
        case "success":
            notif.play()
            icon = '<i class="far fa-check-circle"></i>'
            link = '<a href="' + path + hash + '" target="_blank"><i class="fas fa-external-link-alt"></i></a>'
            break;
        case "connect":
            icon = '<i class="far fa-check-circle"></i>'
            link = ''
            break;
    }
    let notification = '<div class="notification" data="' + hash + '"><div class="loading-icon-wrapper">' + icon + '</div><div class="flex col"><h3>' + func + '</h3><span class="label-small">' + message + ' ' + link + '</span></div></div>'
    $(".notifications").append(notification)
    setTimeout(function() {
        $('.notification[data=' + hash + ']').fadeOut()
    }, 5000)
}

function refresh(element, content) {
    $(element).hide()
    $(element).text(content)
    $(element).fadeIn()
}

function showPanel() {
    $(".connectwallet").hide()
    $(".panel").css("opacity", "1")
}

// https://stackoverflow.com/a/11818658
function toFixed(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?')
    return num.toString().match(re)[0]
}
