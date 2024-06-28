import React from 'react'
import {
    SmallButtonContainer
} from './styles'

export const SmallButton = (props) => {
    const { buttonImage, caption, handleClick } = props;
    return (
        <SmallButtonContainer onClick={handleClick}>
            {buttonImage && <img src={buttonImage} alt='' width='18px' height='18px' />}
            <span>{caption}</span>
        </SmallButtonContainer>
    )
}
