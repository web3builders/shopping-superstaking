<!doctype html>
<html>
  <head>
    <title>Shopping.io Staking Platform 2.0</title>
    <link href="https://shopping.io/wp-content/themes/shopping.io/img/favicon3.ico" rel="shortcut icon">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="css/main.css?v=<?=time();?>">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <script src="js/web3.min.js?v=<?=time();?>"></script>
  </head>
  <body>
    <div class="loadingscreen">
      <div><i class="fas fa-spinner fa-spin"></i></div>
    </div>
    <div class="header flex space-between align-center">
      <div class="flex">
        <img src="https://shopping.io/wp-content/uploads/2020/09/logo-shopping.png" style="width:100%;vertical-align:middle;margin:0 10px;max-width:200px;">
      </div>
      <div class="flex">
        <div id="Navigation" class="navigation flex align-center">
          <div class="link leftright5px"><a href="#" target="_blank">Medium</a></div>
          <div class="link leftright5px"><a href="#" target="_blank">FAQ</a></div>
        </div>
        <div id="Wallet" class="flex align-center">
          <button id="Connect">Connect</button>
        </div>
      </div>
    </div>
    <div class="content">
      <!-- Stake -->
      <div class="section deposit flex col panel">
        <div class="flex col" style="width:100%">
          <div class="subsection flex col">
            <h2>Stake</h2>
            <div class="flex">
              <div class="label-small">Staking in the pool charges a <span class="feeLabel"></span> fee on your <span class="coin"></span> deposit amount which gets distributed to current share holders proportional to their share size</div>
            </div>
          </div>
          <div class="subsection depositInput flex col">
            <div class="label topbottom5px"><span class="coin"></span><span class="erc20Balance left5px">0.00</span> available <span id="stakeAll">[use all]</span></div>
            <div class="flex">
              <input id="depositInput" type="number" min="0">
              <button id="depositToken" class="leftright5px">Confirm</button>
            </div>
            <div class="label-small topbottom5px font-90p"><span>You will get</span> <span id="sharesToGet">0.00</span> <span class="sharesLabel"></span> <span>added to your staking balance</span></div>
          </div>
        </div>
        <div class="wallpaper"></div>
      </div>
      <!-- Unstake -->
      <div class="section unstake flex col panel">
        <div class="flex col" style="width:100%">
          <div class="subsection flex col">
            <h2>Unstake</h2>
            <div class="flex">
              <div class="label-small">Unstaking from the pool charges a <span class="feeLabel"></span> fee on your <span class="sharesLabel"></span> unstake amount which gets distributed to current share holders proportional to their share size</div>
            </div>
          </div>
          <div class="subsection depositInput flex col">
            <div class="label topbottom5px"><span class="userShares left5px">0.00</span> <span class="sharesLabel"></span> available <span id="unstakeAll">[use all]</span></div>
            <div class="flex">
              <input id="sellInput" type="number" min="0">
              <button id="sellToken" class="leftright5px">Confirm</button>
            </div>
            <div class="label-small topbottom5px font-90p"><span>You will get</span> <span id="amtFromSell">0.00</span> <span class="coin"></span> <span>added to your portfolio</span></div>
          </div>
        </div>
        <div class="wallpaper"></div>
      </div>
      <!-- Portfolio -->
      <div class="section extended flex col panel">
        <div class="flex col" style="width:100%">
          <div class="subsection flex col">
            <h2>Portfolio</h2>
            <div class="flex">
              <div class="label-small">You can withdraw your earned staking rewards or reinvest to acquire more <span class="sharesLabel"></span> and increase your earnings potential</div>
            </div>
          </div>
          <div class="subsection flex col">
            <div class="flex stakelist">
              <div class="label">Total <span class="coin"></span> in wallet</div>
              <div class="erc20Balance">0.00</div>
            </div>
            <div class="flex stakelist">
              <div class="label">Total <span class="sharesLabel"></span> acquired</div>
              <span class="userShares">0.00</span>
            </div>
            <div class="flex stakelist">
              <div class="label">Total weight</div>
              <span class="userWeight">0.00</span>
            </div>
            <div class="flex stakelist">
              <div class="label">Earned rewards</div>
              <div><span class="coin"></span> <span class="dividends">0.00</span></div>
            </div>
            <div class="flex" style="margin-top:10px">
              <button id="withdrawDividends">Withdraw</button>
              <button id="reinvestDividends" class="leftright5px">Reinvest</button>
            </div>
          </div>
        </div>
        <div class="wallpaper"></div>
      </div>
      <!-- Global -->
      <div class="section activestakes flex col panel">
        <div class="flex col" style="width:100%">
          <div class="subsection flex col">
            <h2>Global statistics</h2>
            <div class="flex">
              <div class="label-small flex col"><span>The global market overview</span></div>
            </div>
          </div>
          <div class="subsection flex col">
            <div class="flex stakelist">
              <div class="label">Total value locked</div>
              <div><span class="coin"></span> <span class="contractBalance">0.00</span></div>
            </div>
            <div class="flex stakelist">
              <div class="label">&nbsp;</div>
              <div>$USD <span class="contractBalanceInUSD">0.00</span></div>
            </div>
            <div class="flex stakelist" style="margin-top:5px">
              <div class="label">Total <span class="sharesLabel"></span> issued</div>
              <div><span class="totalSharesBalance">0.00</span></div>
            </div>
            <div class="flex stakelist">
              <div class="label">Total participants</div>
              <div><span class="totalHolder">0.00</span></div>
            </div>
          </div>
        </div>
        <div class="wallpaper"></div>
      </div>
      <!-- Notifications -->
      <div id="notifications" class="notifications flex col"></div>
    </div>
    <!-- Thank you -->
    <div class="watermark label-small link">Powered by <a href="https://web3.builders" target="_blank">web3.builders</a></div>
    <!-- Connect your wallet -->
    <div class="section connectwallet flex col">
      <div class="flex col">
        <div class="subsection flex col">
          <h2>Connect</h2>
          <div class="flex">
            <div class="label-small flex col"><span>Please connect your wallet to either Ethereum MainNet or Binance Smart Chain</span></div>
          </div>
        </div>
      </div>
      <div class="wallpaper"></div>
    </div>
    <!-- Enable token -->
    <div class="section enabletoken flex col">
      <div class="flex col">
        <div class="subsection flex col">
          <h2>Enable token</h2>
          <div class="flex col">
            <div class="label-small topbottom5px">Please enable <span class="coin"></span> to be used on this platform!</div>
            <div class="flex">
              <button id="enableToken" class="topbottom5px">Enable</button>
            </div>
          </div>
        </div>
      </div>
      <div class="wallpaper"></div>
    </div>
    <!-- Admin panel -->
    <div class="section adminpanel flex col">
      <div class="close"></div>
      <div class="flex col">
        <div class="flex col">
          <h2>Admin panel</h2>
          <div class="label"><span class="coin"></span><span class="erc20Balance left5px">0.00</span> in wallet</div>
          <div class="flex col adminsection">
            <div class="label-small flex col"><span>Airdrop rewards to your users</span></div>
            <div class="flex">
              <input id="adminDepositInput" type="number" min="0">
              <button id="adminDepositToken" class="leftright5px">Confirm</button>
            </div>
          </div>
        </div>
      </div>
      <div class="wallpaper"></div>
    </div>
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script src="js/blockies.js?v=<?=time();?>"></script>
    <script src="js/abi.js?v=<?=time();?>"></script>
    <script src="js/main.js?v=<?=time();?>"></script>
  </body>
</html>