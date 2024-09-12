
### 7. AWS Environments

```mermaid
block-beta
    columns 2

    block:group1:1
        columns 2
        organization:2
        accounts:2
        l("development [Resources]"):1
        m("production [Resources]"):1
    end
    sso:1
    style m fill:#3CB371,stroke-width:1px
    style l fill:#3CB371,stroke-width:1px
```    

how developers use sso login to get access by SSO system.  


we currently use `IAM Identity Center` but in the future we can change it by a specific user management base on our requirement such LDAP or external SSO start endpoint.


```mermaid
   flowchart LR
  subgraph Organization
    direction TB
    subgraph develop_account
      direction BT
      d_ec2
      d_s3_bucket
    end
    subgraph production_account
      direction BT
      p_ec2
      p_s3_bucket
    end
    subgraph developers
      direction BT
      user1
      user2
      user3
    end
    subgraph SSO_login_system
      direction BT
    end
  end
  develop_account --> developers
  production_account --> developers
  SSO_login_system --> developers

```


