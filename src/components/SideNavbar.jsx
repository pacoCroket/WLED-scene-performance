import React from 'react';
import LocalIpInput from './LocalIpInput';
import MidiFinder from './MidiFinder';

export default function SideNavbar() {
  return (
    <div className="side-navbar border border-primary rounded-end">
      <LocalIpInput />
      <MidiFinder />
    </div>
  );
}
