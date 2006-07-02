// ---------------------------------------------------------------------------------
// Codec conversion routines and SHA-1 hash
// ---------------------------------------------------------------------------------

// Codec "namespace"
function Codec()
{
}

// Convert a string to an array of big-endian 32-bit words
Codec.strToBe32s = function(str)
{
	var be = Array();
	var len = Math.floor(str.length/4);
	var i, j;
	for(i=0, j=0; i<len; i++, j+=4)
		{
		be[i] = ((str.charCodeAt(j)&0xff) << 24)|((str.charCodeAt(j+1)&0xff) << 16)|((str.charCodeAt(j+2)&0xff) << 8)|(str.charCodeAt(j+3)&0xff);
		}
	while (j<str.length)
		{
		be[j>>2] |= (str.charCodeAt(j)&0xff)<<(24-(j*8)%32);
		j++;
		}
	return be;
}

// Convert an array of big-endian 32-bit words to a string
Codec.be32sToStr = function(be)
{
	var str = "";
	for(var i=0;i<be.length*32;i+=8)
		str += String.fromCharCode((be[i>>5]>>>(24-i%32)) & 0xff);
	return str;
}

// Convert an array of big-endian 32-bit words to a hex string
Codec.be32sToHex = function(be)
{
	var hex = "0123456789ABCDEF";
	var str = "";
	for(var i=0;i<be.length*4;i++)
		str += hex.charAt((be[i>>2]>>((3-i%4)*8+4))&0xF) + hex.charAt((be[i>>2]>>((3-i%4)*8))&0xF);
	return str;
}

// Return, in hex, the SHA-1 hash of a string
Codec.hexSha1Str = function(str)
{
	return Codec.be32sToHex(Codec.sha1Str(str));
}

// Return the SHA-1 hash of a string
Codec.sha1Str = function(str)
{
	return Codec.sha1(Codec.strToBe32s(str),str.length);
}

// Calculate the SHA-1 hash of an array of blen bytes of big-endian 32-bit words
Codec.sha1 = function(x,blen)
{
	// Add 32-bit integers, wrapping at 32 bits. Uses 16-bit operations internally
	// to work around bugs in some JavaScript interpreters.
	add32 = function(a,b)
	{
		var lsw = (a&0xFFFF)+(b&0xFFFF);
		var msw = (a>>16)+(b>>16)+(lsw>>16);
		return (msw<<16)|(lsw&0xFFFF);
	};
	// Add five 32-bit integers, wrapping at 32 bits. Uses 16-bit operations internally
	// to work around bugs in some JavaScript interpreters.
	add32x5 = function(a,b,c,d,e)
	{
		var lsw = (a&0xFFFF)+(b&0xFFFF)+(c&0xFFFF)+(d&0xFFFF)+(e&0xFFFF);
		var msw = (a>>16)+(b>>16)+(c>>16)+(d>>16)+(e>>16)+(lsw>>16);
		return (msw<<16)|(lsw&0xFFFF);
	};
	// Bitwise rotate left a 32-bit integer by 1 bit.
	rol32 = function(n)
	{
		return (n>>>31)|(n<<1);
	};

	var len = blen*8;
	// append padding so length in bits is 448 mod 512
	x[len>>5] |= 0x80 << (24-len%32);
	// append length,
	x[((len+64>>9)<<4)+15] = len;
	var w = Array(80);

	var k1 = 0x5A827999;
	var k2 = 0x6ED9EBA1;
	var k3 = 0x8F1BBCDC;
	var k4 = 0xCA62C1D6;

	var h0 = 0x67452301;
	var h1 = 0xEFCDAB89;
	var h2 = 0x98BADCFE;
	var h3 = 0x10325476;
	var h4 = 0xC3D2E1F0;

	for(var i=0;i<x.length;i+=16)
		{
		var j,t;
		var a = h0;
		var b = h1;
		var c = h2;
		var d = h3;
		var e = h4;
		for(j = 0;j<16;j++)
			{
			w[j] = x[i+j];
			t = add32x5((a>>>27)|(a<<5), (b&c)|(~b&d), e, w[j], k1);
			e=d; d=c; c=(b>>>2)|(b<<30); b=a; a = t;
			}
		for(j=16;j<20;j++)
			{
			w[j] = rol32(w[j-3]^w[j-8]^w[j-14]^w[j-16]);
			t = add32x5((a>>>27)|(a<<5), (b&c)|(~b&d), e, w[j], k1);
			e=d; d=c; c=(b>>>2)|(b<<30); b=a; a = t;
			}
		for(j=20;j<40;j++)
			{
			w[j] = rol32(w[j-3]^w[j-8]^w[j-14]^w[j-16]);
			t = add32x5((a>>>27)|(a<<5),b^c^d,e,w[j],k2);
			e=d; d=c; c=(b>>>2)|(b<<30); b=a; a = t;
			}
		for(j=40;j<60;j++)
			{
			w[j] = rol32(w[j-3]^w[j-8]^w[j-14]^w[j-16]);
			t = add32x5((a>>>27)|(a<<5),(b&c)|(b&d)|(c&d),e,w[j],k3);
			e=d; d=c; c=(b>>>2)|(b<<30); b=a; a = t;
			}
		for(j=60;j<80;j++)
			{
			w[j] = rol32(w[j-3]^w[j-8]^w[j-14]^w[j-16]);
			t = add32x5((a>>>27)|(a<<5),b^c^d,e,w[j],k4);
			e=d; d=c; c=(b>>>2)|(b<<30); b=a; a = t;
			}

		h0 = add32(h0,a);
		h1 = add32(h1,b);
		h2 = add32(h2,c);
		h3 = add32(h3,d);
		h4 = add32(h4,e);
		}
	return Array(h0,h1,h2,h3,h4);
}

