import { FolderOutlined } from '@ant-design/icons';

const icons = {
  FolderOutlined
};

// ==============================|| MENU ITEMS - ARTISTS ||============================== //

const artists = {
  id: 'group-artists',
  title: 'Artists',
  type: 'group',
  children: [
    {
      id: 'index-artist',
      title: 'Manege Artists',
      type: 'item',
      url: 'artists/index',
      icon: icons.FolderOutlined,
      breadcrumbs: false
    }
  ]
};

export default artists;
