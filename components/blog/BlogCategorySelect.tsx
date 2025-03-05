import React from "react";
import { Select } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { isEmpty } from "lodash";

const { Option, OptGroup } = Select;

const categories = [
    {
      parent: "Lifestyle",
      children: [
        { id: 1, name: "Health & Wellness" },
        { id: 2, name: "Travel" },
        { id: 3, name: "Food & Drink" },
        { id: 4, name: "Beauty & Fashion" },
        { id: 5, name: "Home & Decor" },
        { id: 6, name: "Personal Development" },
        { id: 7, name: "Hobbies & Interests" },
      ],
    },
    {
      parent: "Technology",
      children: [
        { id: 8, name: "Gadgets & Reviews" },
        { id: 9, name: "Software & Apps" },
        { id: 10, name: "Programming & Development" },
        { id: 11, name: "Tech News & Trends" },
        { id: 12, name: "Cybersecurity" },
        { id: 13, name: "Artificial Intelligence & Machine Learning" },
      ],
    },
    {
      parent: "Business & Finance",
      children: [
        { id: 14, name: "Entrepreneurship" },
        { id: 15, name: "Marketing & Sales" },
        { id: 16, name: "Investing & Trading" },
        { id: 17, name: "Personal Finance" },
        { id: 18, name: "Business Management" },
        { id: 19, name: "Startups & Innovation" },
      ],
    },
    // Add more parent-child categories as needed
  ];

const BlogCategorySelect = ({defaultValue, value, onChange}: {defaultValue?: any, value: any, onChange: ((id: number, parentName: string, name: string) => void)}) => {
  
  return (
    <Select
      style={{ maxWidth: 300, width: '100%' }}
      placeholder="Select a blog category"
      allowClear
      optionFilterProp="children"
      defaultValue={defaultValue}
      value={value}
      onChange={(v) => {
        const category = categories.find(item => item.children.findIndex(ci => ci.id === +v) > -1);
        if (!isEmpty(category)) {
            const item = category.children.find(i => i.id === +v);
            if (!isEmpty(item)) {
                onChange(+v, category.parent, item.name);
            }
        }
      }}
    >
      {categories.map((group, index) => (
        <OptGroup key={index} label={group.parent}>
          {group.children.map((child) => (
            <Option key={child.id} value={child.id}>
              {child.name}
            </Option>
          ))}
        </OptGroup>
      ))}
    </Select>
  );
};

export default BlogCategorySelect;