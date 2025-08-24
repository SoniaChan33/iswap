/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/iswap.json`.
 */
export type Iswap = {
  "address": "2vjDGp1wRYdiHeZae7p1h6KphvTMaGZ7RvVZWmN8mvsK",
  "metadata": {
    "name": "iswap",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "etfCreate",
      "discriminator": [
        0,
        81,
        62,
        85,
        242,
        37,
        4,
        245
      ],
      "accounts": [
        {
          "name": "etfTokenInfo",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  69,
                  84,
                  70,
                  95,
                  84,
                  79,
                  75,
                  69,
                  78
                ]
              },
              {
                "kind": "account",
                "path": "etfTokenMintAccount"
              }
            ]
          }
        },
        {
          "name": "etfMetadataAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "tokenMetadataProgram"
              },
              {
                "kind": "account",
                "path": "etfTokenMintAccount"
              }
            ],
            "program": {
              "kind": "account",
              "path": "tokenMetadataProgram"
            }
          }
        },
        {
          "name": "etfTokenMintAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  69,
                  84,
                  70,
                  95,
                  84,
                  79,
                  75,
                  69,
                  78
                ]
              },
              {
                "kind": "arg",
                "path": "args.symbol"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenMetadataProgram",
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "etfTokenArgs"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "etfToken",
      "discriminator": [
        187,
        90,
        26,
        73,
        137,
        112,
        105,
        60
      ]
    }
  ],
  "types": [
    {
      "name": "etfAsset",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "type": "pubkey"
          },
          {
            "name": "weight",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "etfToken",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mintAccount",
            "type": "pubkey"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "createAt",
            "type": "i64"
          },
          {
            "name": "descriptor",
            "type": "string"
          },
          {
            "name": "assets",
            "type": {
              "vec": {
                "defined": {
                  "name": "etfAsset"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "etfTokenArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "url",
            "type": "string"
          },
          {
            "name": "assets",
            "type": {
              "vec": {
                "defined": {
                  "name": "etfAsset"
                }
              }
            }
          }
        ]
      }
    }
  ]
};
