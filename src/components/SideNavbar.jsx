import React from 'react';
import LocalIpInput from './LocalIpInput';
import MidiFinder from './MidiFinder';

export default function SideNavbar() {
  return (
    <div className="side-navbar rounded-r-lg border border-l-0 border-white">
      <LocalIpInput />
      <MidiFinder />
    </div>
  );
}
