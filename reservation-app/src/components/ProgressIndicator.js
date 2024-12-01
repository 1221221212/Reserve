// ProgressIndicator.js
import React from 'react';
import '../styles/progressIndicator.scss';

const ProgressIndicator = ({ steps, currentStep }) => {
    return (
        <ol className="c-stepper">
            {steps.map((step, index) => (
                <li
                    key={index}
                    className={`c-stepper__item ${currentStep - 1 > index ? 'completed' : ''
                        } ${currentStep - 1 === index ? 'current' : ''}`}
                >
                    <span className="check"></span>
                    <span className="c-stepper__title">{step}</span>
                </li>
            ))}
        </ol>
    );
};

export default ProgressIndicator;