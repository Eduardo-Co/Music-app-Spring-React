import { FolderOutlined } from '@ant-design/icons';

const icons = {
    FolderOutlined,
};


const albums = {
  id: 'group-tracks',
  title: 'Tracks',
  type: 'group',
  children: [
    {
      id: 'index-track',
      title: 'Manage Tracks',
      type: 'item',
      url: 'tracks/index',
      icon: icons.FolderOutlined, 
      breadcrumbs: false,
    },
  ],
};

export default albums;
