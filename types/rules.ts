import { Rule } from "antd/es/form";

export const buildMaxRule = (max: number): Rule => {

    return {max, message: `Max ${max} characters!`};
}

export const buildMinRule = (min: number): Rule => {

    return {min, message: `Please leave more than ${min} characters!`};
}