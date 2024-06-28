import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    amount: 100.0,
    duration: 12,
    interest: 3,
    collateral: 0,
    listingFee: 0,
    history: {
        borrowed: 0,
        collateral: 0,
        fee: 0,
    }
}

const loanSlice = createSlice({
    name: 'loan',
    initialState,
    reducers: {
        setAmount: (state, action) => {
            state.amount = action.payload
        },
        setDuration: (state, action) => {
            state.duration = action.payload
        },
        setInterest: (state, action) => {
            state.interest = action.payload
        },
        setCollateral: (state, action) => {
            state.collateral = action.payload
        },
        setListingFee: (state, action) => {
            state.listingFee = action.payload
        },
        setHistory: (state, action) => {
            state.history = action.payload
        }
    }
})

export const {setAmount, setDuration, setInterest, setCollateral, setListingFee, setHistory} = loanSlice.actions

export default loanSlice.reducer
