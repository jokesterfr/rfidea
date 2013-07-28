# RFIDEA

## About the stuff 

An idea to manage your contactless discography, written in NodeJS, with simple tools provided.
This project is still experimental, any contributions are welcome.

## Installing

You need to install these dependencies :

* mpd - music player daemon
* libnfc
* pcsc
* mongodb

Then just do as usual:

	npm install

Note you would likely require a contactless reader, and some contactless tags. I can suggest you the ones I've got:

* [Mifare chips 13.56Mhz ISO14443A](http://www.aliexpress.com/snapshot/237740055.html)
* [ACR122U 13.56 MHz RFID Card Reader](http://www.aliexpress.com/snapshot/237740054.html)

Then you have to set chips on the back of each CD cover.

I would not recommand the ACR122U reader, beacause it's not officialy [supported by PCSC](http://pcsclite.alioth.debian.org/ccid/unsupported.html#0x072F0x2200), and have some limited support on Linux (no extended APDU).

I could support it this way nevertheless: 

### ACR122 driver from ACS

~~~{.bash}
wget http://www.acs.com.hk/drivers/eng/ACR122_Driver_Lnx_Mac10.5_10.6_10.7_104_P.zip
unzip -d acr122u ACR122_Driver_Lnx_Mac10.5_10.6_10.7_104_P.zip
cd acr122u 
tar -jxvf acsccid-1.0.4
cd acsccid-1.0.4
./configure
make
sudo make install
~~~

### NFC-tools

~~~{.bash}
sudo apt-get install libusb-dev libpcsclite-dev debhelper libtool dh-autoreconf
sudo apt-get install libusb-0.1-4 libpcsclite1 libccid pcscd
git clone https://code.google.com/p/libnfc/
cd libnfc
dpkg-buildpackage -b -us -uc
sudo dpkg -i ../libnfc*.deb
# you can then try `nfc-list`
~~~

## Licence

The MIT License (MIT)

Copyright (c) 2013 Clément Désiles <main@jokester.fr>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
