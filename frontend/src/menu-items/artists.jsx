import { UserAddOutlined } from '@ant-design/icons';

const icons = {
    UserAddOutlined
};

// ==============================|| MENU ITEMS - ARTISTS ||============================== //

const artists = {
  id: 'group-artists',
  title: 'Artists',
  type: 'group',
  children: [
    {
      id: 'create-artist',
      title: 'Create',
      type: 'item',
      url: 'artists/create',
      icon: icons.UserAddOutlined,
      breadcrumbs: false
    }
  ]
};

export default artists;
