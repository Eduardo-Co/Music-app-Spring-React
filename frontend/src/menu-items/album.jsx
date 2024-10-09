import { FolderOutlined } from '@ant-design/icons';

const icons = {
    FolderOutlined,
};


const albums = {
  id: 'group-albums',
  title: 'Albums',
  type: 'group',
  children: [
    {
      id: 'index-album',
      title: 'Manage Albums',
      type: 'item',
      url: 'albums/index',
      icon: icons.FolderOutlined, 
      breadcrumbs: false,
    },
  ],
};

export default albums;
